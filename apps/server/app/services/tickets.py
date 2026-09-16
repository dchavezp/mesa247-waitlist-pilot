import threading
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlmodel import Session, select

from ..core.config import settings
from ..models import QueueEntry, QueueStatus, Restaurant

ACTIVE_STATUSES = (QueueStatus.WAITING, QueueStatus.NOTIFIED)
TERMINAL_STATUSES = (QueueStatus.SEATED, QueueStatus.CANCELLED, QueueStatus.NO_SHOW)
SEATED_HISTORY_WINDOW = 10

# Position assignment is read-then-write (COUNT + INSERT) and neither DB offers
# a portable conditional unique index on active positions (terminal rows keep
# historical positions that would collide). The pilot runs a single process, so
# joins are serialized in-process; multi-process deployments need a DB-level
# mechanism instead.
_join_lock = threading.Lock()

TRANSITIONS: dict[str, tuple[tuple[QueueStatus, ...], QueueStatus]] = {
    "notify": ((QueueStatus.WAITING, QueueStatus.NOTIFIED), QueueStatus.NOTIFIED),
    "seat": ((QueueStatus.NOTIFIED,), QueueStatus.SEATED),
    "cancel": (ACTIVE_STATUSES, QueueStatus.CANCELLED),
    "no_show": (ACTIVE_STATUSES, QueueStatus.NO_SHOW),
}


class CrossRestaurantAccessError(Exception):
    """The authenticated token does not cover the ticket's restaurant."""


@dataclass
class TicketStatus:
    id: str
    status: QueueStatus
    position: int
    estimated_minutes: int


@dataclass
class HostQueueItem:
    id: str
    customer_name: str
    party_size: int
    status: QueueStatus
    position: int
    estimated_minutes: int
    notified_at: datetime | None = None


@dataclass
class DayReport:
    joined: int
    seated: int
    left_without_seat: int
    no_show: int
    avg_wait_minutes: int


def get_restaurant_by_slug(session: Session, slug: str) -> Restaurant | None:
    return session.exec(select(Restaurant).where(Restaurant.slug == slug)).first()


def join_queue(
    session: Session,
    restaurant: Restaurant,
    customer_name: str,
    phone_number: str,
    party_size: int,
) -> QueueEntry:
    with _join_lock:
        entry = QueueEntry(
            restaurant_id=restaurant.id,
            customer_name=customer_name,
            phone_number=phone_number,
            party_size=party_size,
            position_index=_next_position(session, restaurant.id),
        )
        session.add(entry)
        session.commit()
        session.refresh(entry)
    return entry


def get_ticket_status(session: Session, ticket_id: str) -> TicketStatus | None:
    entry = session.get(QueueEntry, ticket_id)
    if entry is None:
        return None
    position = _live_rank(session, entry.restaurant_id, entry.position_index)
    return TicketStatus(
        id=entry.id,
        status=entry.status,
        position=position,
        estimated_minutes=position * _minutes_per_group(session, entry.restaurant_id),
    )


def get_host_queue(session: Session, restaurant: Restaurant) -> list[HostQueueItem]:
    """Today's entries for the host board: the live queue first, then history.

    The host keeps served/cancelled cards visible with their status chip, so
    this returns every ticket created today — active ones in queue order, then
    terminal ones most recent first. Reorder still validates only against the
    active ids (contrato D3)."""
    now_utc = _as_utc_naive(datetime.now(timezone.utc))
    day_start = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)
    entries = session.exec(
        select(QueueEntry).where(
            QueueEntry.restaurant_id == restaurant.id,
            QueueEntry.created_at >= day_start,
            QueueEntry.created_at < day_end,
        )
    ).all()
    active = sorted(
        (e for e in entries if e.status in ACTIVE_STATUSES),
        key=lambda e: e.position_index,
    )
    terminal = sorted(
        (e for e in entries if e.status not in ACTIVE_STATUSES),
        key=lambda e: e.created_at,
        reverse=True,
    )
    minutes_per_group = _minutes_per_group(session, restaurant.id)
    return [
        HostQueueItem(
            id=entry.id,
            customer_name=entry.customer_name,
            party_size=entry.party_size,
            status=entry.status,
            position=entry.position_index,
            estimated_minutes=entry.position_index * minutes_per_group,
            notified_at=entry.notified_at,
        )
        for entry in [*active, *terminal]
    ]


def apply_transition(
    session: Session,
    ticket_id: str,
    action: str,
    expected_restaurant_id: str | None = None,
) -> TicketStatus | None:
    entry = session.get(QueueEntry, ticket_id)
    if entry is None:
        return None
    if expected_restaurant_id is not None and entry.restaurant_id != expected_restaurant_id:
        raise CrossRestaurantAccessError("El turno no pertenece al local autenticado")
    allowed_sources, target = TRANSITIONS[action]
    if entry.status not in allowed_sources:
        if action == "seat" and entry.status == QueueStatus.WAITING:
            raise ValueError("Debe llamar al turno antes de sentarlo")
        raise ValueError(f"El turno ya está {entry.status.value}")
    entry.status = target
    if target is QueueStatus.NOTIFIED:
        entry.notified_at = datetime.now(timezone.utc)
    elif target is QueueStatus.SEATED:
        entry.seated_at = datetime.now(timezone.utc)
    if target in TERMINAL_STATUSES:
        _reindex_active(session, entry.restaurant_id)
    session.commit()
    session.refresh(entry)
    position = _live_rank(session, entry.restaurant_id, entry.position_index)
    return TicketStatus(
        id=entry.id,
        status=entry.status,
        position=position,
        estimated_minutes=position * _minutes_per_group(session, entry.restaurant_id),
    )


def reorder_queue(
    session: Session, restaurant: Restaurant, order: list[str]
) -> list[HostQueueItem]:
    active = _active_entries(session, restaurant.id)
    active_ids = {entry.id for entry in active}
    if set(order) != active_ids or len(order) != len(active_ids):
        raise ValueError(
            "El orden enviado no coincide con los turnos activos; la tablet debe resincronizar"
        )
    by_id = {entry.id: entry for entry in active}
    for position, ticket_id in enumerate(order, start=1):
        by_id[ticket_id].position_index = position
    session.commit()
    return get_host_queue(session, restaurant)


def get_day_report(session: Session, restaurant: Restaurant) -> DayReport:
    now_utc = _as_utc_naive(datetime.now(timezone.utc))
    day_start = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)
    created_today = session.exec(
        select(QueueEntry).where(
            QueueEntry.restaurant_id == restaurant.id,
            QueueEntry.created_at >= day_start,
            QueueEntry.created_at < day_end,
        )
    ).all()

    seated_today = [
        entry
        for entry in created_today
        if entry.status == QueueStatus.SEATED and entry.seated_at is not None
    ]
    if seated_today:
        minutes = [
            (_as_utc_naive(entry.seated_at) - _as_utc_naive(entry.created_at)).total_seconds() / 60
            for entry in seated_today
        ]
        avg_wait_minutes = round(sum(minutes) / len(minutes))
    else:
        avg_wait_minutes = 0

    # All counts are people, not groups: a party of 4 consumes four seats (U31).
    return DayReport(
        joined=sum(e.party_size for e in created_today),
        seated=sum(e.party_size for e in created_today if e.status == QueueStatus.SEATED),
        left_without_seat=sum(e.party_size for e in created_today if e.status == QueueStatus.CANCELLED),
        no_show=sum(e.party_size for e in created_today if e.status == QueueStatus.NO_SHOW),
        avg_wait_minutes=avg_wait_minutes,
    )


def _next_position(session: Session, restaurant_id: str) -> int:
    active = session.exec(
        select(func.count(QueueEntry.id)).where(
            QueueEntry.restaurant_id == restaurant_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
        )
    ).one()
    return active + 1


def _live_rank(session: Session, restaurant_id: str, position_index: int) -> int:
    return session.exec(
        select(func.count(QueueEntry.id)).where(
            QueueEntry.restaurant_id == restaurant_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
            QueueEntry.position_index <= position_index,
        )
    ).one()


def _minutes_per_group(session: Session, restaurant_id: str) -> int:
    recent_seated = session.exec(
        select(QueueEntry)
        .where(
            QueueEntry.restaurant_id == restaurant_id,
            QueueEntry.status == QueueStatus.SEATED,
            QueueEntry.seated_at.is_not(None),
        )
        .order_by(QueueEntry.seated_at.desc())
        .limit(SEATED_HISTORY_WINDOW)
    ).all()

    if not recent_seated:
        return settings.default_minutes_per_group

    durations = [
        (_as_utc_naive(entry.seated_at) - _as_utc_naive(entry.created_at)).total_seconds() / 60
        for entry in recent_seated
    ]
    return max(1, round(sum(durations) / len(durations)))


def _active_entries(session: Session, restaurant_id: str) -> list[QueueEntry]:
    return session.exec(
        select(QueueEntry)
        .where(
            QueueEntry.restaurant_id == restaurant_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
        )
        .order_by(QueueEntry.position_index)
    ).all()


def _reindex_active(session: Session, restaurant_id: str) -> None:
    for position, entry in enumerate(_active_entries(session, restaurant_id), start=1):
        entry.position_index = position


def _as_utc_naive(value: datetime) -> datetime:
    # Drivers round-trip the aware UTC defaults as naive wall time (SQLite/MySQL),
    # so normalize before subtracting to never mix aware and naive datetimes.
    if value.tzinfo is not None:
        return value.astimezone(timezone.utc).replace(tzinfo=None)
    return value