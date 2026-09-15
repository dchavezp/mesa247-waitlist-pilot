import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from ..core.config import settings
from ..models import Restaurant

_PBKDF2_ITERATIONS = 100_000


def hash_pin(pin: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", pin.encode(), salt, _PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${_PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_pin(pin: str, stored: str) -> bool:
    try:
        prefix, iterations, salt_hex, digest_hex = stored.split("$")
        if prefix != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", pin.encode(), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(digest, bytes.fromhex(digest_hex))
    except (TypeError, ValueError):
        return False


def create_access_token(restaurant: Restaurant) -> tuple[str, int]:
    expires_in = settings.jwt_expire_minutes * 60
    now = datetime.now(timezone.utc)
    payload = {
        "sub": restaurant.id,
        "slug": restaurant.slug,
        "iat": now,
        "exp": now + timedelta(seconds=expires_in),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
    return token, expires_in