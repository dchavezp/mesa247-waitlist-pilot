from dataclasses import dataclass

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..services.auth import decode_access_token

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class HostIdentity:
    restaurant_id: str
    slug: str


def require_host(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> HostIdentity:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Autenticación requerida")
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return HostIdentity(restaurant_id=payload["sub"], slug=payload["slug"])


def require_host_for(
    slug: str, identity: HostIdentity = Depends(require_host)
) -> HostIdentity:
    if identity.slug != slug:
        raise HTTPException(status_code=401, detail="Credenciales inválidas para este local")
    return identity