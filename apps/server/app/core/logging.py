import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("mesa247.http")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Una línea por request: método, path, status, duración y cliente.

    Nunca loguea el cuerpo (teléfonos/PIN son PII) ni la query string.
    """

    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        client = request.client.host if request.client else "-"
        status = 499  # cliente cortó antes de recibir respuesta
        try:
            response = await call_next(request)
            status = response.status_code
        finally:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.info(
                "%s %s %d %.1fms client=%s",
                request.method,
                request.url.path,
                status,
                duration_ms,
                client,
            )
        return response