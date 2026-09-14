from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from .. import models  # noqa: F401 — registers tables in SQLModel.metadata
from .config import settings

_connect_args: dict = {}
if settings.database_url.startswith("sqlite"):
    _connect_args["check_same_thread"] = False

engine = create_engine(settings.database_url, connect_args=_connect_args)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session