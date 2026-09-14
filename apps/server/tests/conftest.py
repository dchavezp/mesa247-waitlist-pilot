import os
import tempfile
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

# Redirect the engine to a throwaway SQLite file BEFORE app.core.config is
# imported: Settings reads DATABASE_URL at import time and core/db.py builds
# the engine from it exactly once. Env vars outrank .env, so tests can never
# open the real mesa247.db.
_test_dir = tempfile.mkdtemp(prefix="mesa247-tests-")
os.environ["DATABASE_URL"] = f"sqlite:///{_test_dir}/test.db"

from app.core.db import engine  # noqa: E402
from app.main import create_app  # noqa: E402
from app.models import Restaurant  # noqa: E402
from app.seed import seed  # noqa: E402


@pytest.fixture
def client():
    # The context manager runs the lifespan, so init_db() creates the tables
    # in the temp database before any request.
    with TestClient(create_app()) as client:
        yield client


@pytest.fixture
def seed_restaurants():
    # Same code path as `uv run python -m app.seed`; idempotent.
    seed()


@pytest.fixture
def make_restaurant():
    """Create a restaurant with a unique slug so every test starts from an
    empty queue without cross-test state."""

    def _make(name: str = "Test Place", country_code: str = "PE") -> Restaurant:
        with Session(engine) as session:
            restaurant = Restaurant(
                name=name,
                slug=f"test-{uuid4().hex[:12]}",
                country_code=country_code,
            )
            session.add(restaurant)
            session.commit()
            session.refresh(restaurant)
        return restaurant

    return _make