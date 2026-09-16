import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# uvicorn no configura handlers para loggers propios (solo uvicorn.*); sin esto
# mesa247.http (RequestLoggingMiddleware) no tiene dónde imprimir.
logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s: %(message)s")

from .api.routes import guest, health, host
from .core.config import settings
from .core.db import init_db
from .core.logging import RequestLoggingMiddleware


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)

    app.include_router(guest.router)
    app.include_router(host.router)
    app.include_router(health.router)

    return app


app = create_app()