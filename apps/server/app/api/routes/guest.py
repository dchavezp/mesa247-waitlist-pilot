from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ...core.db import get_session
from ...services.tickets import (
    apply_transition,
    get_restaurant_by_slug,
    get_ticket_status,
    join_queue,
)
from ..schemas import JoinRequest, JoinResponse, RestaurantInfoResponse, TicketStatusResponse

router = APIRouter(tags=["guest"])


@router.get("/join/{slug}", response_model=RestaurantInfoResponse)
def restaurant_info(
    slug: str, session: Session = Depends(get_session)
) -> RestaurantInfoResponse:
    # Público: el comensal confirma el local antes de dar sus datos. Reverso
    # del GET /host/{slug} autenticado (mismo shape, sin token).
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    return RestaurantInfoResponse.model_validate(restaurant)


@router.post("/join/{slug}", status_code=201, response_model=JoinResponse)
def join(
    slug: str, payload: JoinRequest, session: Session = Depends(get_session)
) -> JoinResponse:
    restaurant = get_restaurant_by_slug(session, slug)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Local no encontrado")
    entry = join_queue(
        session,
        restaurant,
        payload.customer_name,
        payload.phone_number,
        payload.party_size,
    )
    return JoinResponse(id=entry.id, position=entry.position_index)


@router.get("/tickets/{ticket_id}", response_model=TicketStatusResponse)
def ticket_status(
    ticket_id: str, session: Session = Depends(get_session)
) -> TicketStatusResponse:
    ticket = get_ticket_status(session, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return TicketStatusResponse.model_validate(ticket)


@router.post("/tickets/{ticket_id}/no-show", response_model=TicketStatusResponse)
def leave_queue(
    ticket_id: str, session: Session = Depends(get_session)
) -> TicketStatusResponse:
    # El "Ya no voy" del comensal es NO_SHOW (D24): el reporte distingue
    # CANCELLED (cancela el anfitrión) de NO_SHOW (no vinieron al llamado).
    # Conocer el id del ticket equivale a poseerlo: UUID no adivinable, mismo
    # modelo de confianza que GET /tickets/{id} en el piloto.
    try:
        status = apply_transition(session, ticket_id, "no_show")
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    if status is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return TicketStatusResponse.model_validate(status)