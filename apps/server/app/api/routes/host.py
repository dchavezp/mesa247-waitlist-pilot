"""Rutas del anfitrión: cola en vivo, transiciones de turnos y reporte del día."""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ...core.db import get_session
from ...services.tickets import (
    apply_transition,
    get_day_report,
    get_host_queue,
    get_restaurant_by_slug,
    reorder_queue,
)
from ..schemas import (
    DayReportResponse,
    HostQueueItem,
    HostTransitionRequest,
    ReorderRequest,
    TicketStatusResponse,
)

router = APIRouter(tags=["host"])


@router.get("/host/{slug}/queue", response_model=list[HostQueueItem])
def host_queue(
    slug: str, session: Session = Depends(get_session)
) -> list[HostQueueItem]:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return [HostQueueItem.model_validate(item) for item in get_host_queue(session, restaurant)]


@router.patch("/tickets/{ticket_id}", response_model=TicketStatusResponse)
def update_ticket(
    ticket_id: str,
    payload: HostTransitionRequest,
    session: Session = Depends(get_session),
) -> TicketStatusResponse:
    try:
        status = apply_transition(session, ticket_id, payload.action)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    if status is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return TicketStatusResponse.model_validate(status)


@router.post("/host/{slug}/queue/reorder", response_model=list[HostQueueItem])
def reorder(
    slug: str, payload: ReorderRequest, session: Session = Depends(get_session)
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
    slug: str, session: Session = Depends(get_session)
) -> DayReportResponse:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return DayReportResponse.model_validate(get_day_report(session, restaurant))