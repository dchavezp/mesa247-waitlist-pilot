from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ...core.db import get_session
from ...services.tickets import get_restaurant_by_slug, get_ticket_status, join_queue
from ..schemas import JoinRequest, JoinResponse, TicketStatusResponse

router = APIRouter(tags=["guest"])


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