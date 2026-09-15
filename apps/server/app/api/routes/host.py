from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ...core.db import get_session
from ...services.auth import create_access_token, verify_pin
from ...services.tickets import (
    CrossRestaurantAccessError,
    apply_transition,
    get_day_report,
    get_host_queue,
    get_restaurant_by_slug,
    reorder_queue,
)
from ..deps import HostIdentity, require_host, require_host_for
from ..schemas import (
    DayReportResponse,
    HostLoginRequest,
    HostLoginResponse,
    HostQueueItem,
    HostTransitionRequest,
    ReorderRequest,
    TicketStatusResponse,
)

router = APIRouter(tags=["host"])


@router.get("/host/{slug}/queue", response_model=list[HostQueueItem])
def host_queue(
    slug: str,
    _identity: HostIdentity = Depends(require_host_for),
    session: Session = Depends(get_session),
) -> list[HostQueueItem]:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return [HostQueueItem.model_validate(item) for item in get_host_queue(session, restaurant)]


@router.patch("/tickets/{ticket_id}", response_model=TicketStatusResponse)
def update_ticket(
    ticket_id: str,
    payload: HostTransitionRequest,
    identity: HostIdentity = Depends(require_host),
    session: Session = Depends(get_session),
) -> TicketStatusResponse:
    try:
        status = apply_transition(
            session, ticket_id, payload.action, expected_restaurant_id=identity.restaurant_id
        )
    except CrossRestaurantAccessError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    if status is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return TicketStatusResponse.model_validate(status)


@router.post("/host/{slug}/queue/reorder", response_model=list[HostQueueItem])
def reorder(
    slug: str,
    payload: ReorderRequest,
    _identity: HostIdentity = Depends(require_host_for),
    session: Session = Depends(get_session),
) -> list[HostQueueItem]:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    try:
        queue = reorder_queue(session, restaurant, payload.order)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    return [HostQueueItem.model_validate(item) for item in queue]


@router.get("/host/{slug}/report", response_model=DayReportResponse)
def day_report(
    slug: str,
    _identity: HostIdentity = Depends(require_host_for),
    session: Session = Depends(get_session),
) -> DayReportResponse:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return DayReportResponse.model_validate(get_day_report(session, restaurant))


@router.post("/host/{slug}/login", response_model=HostLoginResponse)
def host_login(
    slug: str, payload: HostLoginRequest, session: Session = Depends(get_session)
) -> HostLoginResponse:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    if not verify_pin(payload.pin, restaurant.pin_code_hash):
        raise HTTPException(status_code=401, detail="PIN incorrecto")
    token, expires_in = create_access_token(restaurant)
    return HostLoginResponse(access_token=token, expires_in=expires_in)