from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from ..models import QueueStatus


class JoinRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=100)
    phone_number: str = Field(min_length=1, max_length=20)
    party_size: int = Field(gt=0)


class JoinResponse(BaseModel):
    id: str
    position: int


class TicketStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: QueueStatus
    position: int
    estimated_minutes: int


class HostQueueItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    customer_name: str
    party_size: int
    status: QueueStatus
    position: int
    estimated_minutes: int
    notified_at: datetime | None = None


class HostTransitionRequest(BaseModel):
    action: Literal["notify", "seat", "cancel", "no_show"]


class ReorderRequest(BaseModel):
    order: list[str]


class DayReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    joined: int
    seated: int
    left_without_seat: int
    no_show: int
    avg_wait_minutes: int


class HostLoginRequest(BaseModel):
    pin: str = Field(min_length=6, max_length=6, pattern=r"^[a-zA-Z0-9]{6}$")


class HostLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int