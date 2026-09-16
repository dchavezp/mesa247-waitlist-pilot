import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlmodel import Field, Relationship, SQLModel


class QueueStatus(str, Enum):
    WAITING = "WAITING"
    NOTIFIED = "NOTIFIED"
    SEATED = "SEATED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class Restaurant(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(max_length=100)
    description: str | None = Field(default=None, max_length=200)
    slug: str = Field(unique=True, index=True, max_length=50)
    country_code: str = Field(max_length=5)
    pin_code_hash: str = Field(max_length=120)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    entries: list["QueueEntry"] = Relationship(back_populates="restaurant")


class QueueEntry(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    restaurant_id: str = Field(foreign_key="restaurant.id", index=True)
    customer_name: str = Field(max_length=100)
    phone_number: str = Field(max_length=20)
    party_size: int = Field(gt=0)
    status: QueueStatus = Field(default=QueueStatus.WAITING)
    position_index: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notified_at: datetime | None = None
    seated_at: datetime | None = None

    restaurant: Restaurant = Relationship(back_populates="entries")