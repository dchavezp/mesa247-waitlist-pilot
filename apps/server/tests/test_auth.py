from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings
from test_guest import auth_headers, join, login


def test_login_with_wrong_pin_returns_401(client, make_restaurant):
    slug = make_restaurant().slug
    response = client.post(f"/host/{slug}/login", json={"pin": "000000"})
    assert response.status_code == 401


def test_login_unknown_restaurant_returns_404(client):
    response = client.post("/host/does-not-exist/login", json={"pin": "111111"})
    assert response.status_code == 404


def test_protected_endpoints_require_a_token(client, make_restaurant):
    slug = make_restaurant().slug
    ticket_id = join(client, slug, "Ana")["id"]

    assert client.get(f"/host/{slug}/queue").status_code == 401
    assert client.get(f"/host/{slug}/report").status_code == 401
    assert client.post(f"/host/{slug}/queue/reorder", json={"order": []}).status_code == 401
    assert client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}).status_code == 401


def test_malformed_tokens_return_401(client, make_restaurant):
    restaurant = make_restaurant()
    slug = restaurant.slug
    real_token = login(client, slug)
    now = datetime.now(timezone.utc)
    wrong_secret_token = jwt.encode(
        {
            "sub": restaurant.id,
            "slug": slug,
            "iat": now,
            "exp": now + timedelta(hours=1),
        },
        "wrong-secret",
        algorithm="HS256",
    )

    for token in ("not-a-jwt", "", "abc.def.ghi", wrong_secret_token):
        headers = {"Authorization": f"Bearer {token}"}
        assert client.get(f"/host/{slug}/queue", headers=headers).status_code == 401

    # A non-Bearer scheme is rejected too.
    non_bearer = {"Authorization": f"Token {real_token}"}
    assert client.get(f"/host/{slug}/queue", headers=non_bearer).status_code == 401


def test_expired_token_returns_401(client, make_restaurant):
    restaurant = make_restaurant()
    slug = restaurant.slug
    now = datetime.now(timezone.utc)
    token = jwt.encode(
        {
            "sub": restaurant.id,
            "slug": slug,
            "iat": now - timedelta(hours=1),
            "exp": now - timedelta(minutes=30),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )
    response = client.get(f"/host/{slug}/queue", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_valid_token_allows_host_access(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)

    assert client.get(f"/host/{slug}/queue", headers=headers).status_code == 200

    ticket_id = join(client, slug, "Ana")["id"]
    response = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "NOTIFIED"


def test_token_of_another_restaurant_is_rejected_for_host_routes(client, make_restaurant):
    restaurant_a = make_restaurant()
    restaurant_b = make_restaurant()
    a_headers = auth_headers(client, restaurant_a.slug)
    b_headers = auth_headers(client, restaurant_b.slug)

    assert client.get(f"/host/{restaurant_b.slug}/queue", headers=a_headers).status_code == 401
    assert client.get(f"/host/{restaurant_a.slug}/queue", headers=b_headers).status_code == 401


def test_token_of_another_restaurant_is_rejected_for_ticket_transitions(
    client, make_restaurant
):
    restaurant_a = make_restaurant()
    restaurant_b = make_restaurant()
    a_headers = auth_headers(client, restaurant_a.slug)

    ticket_id = join(client, restaurant_b.slug, "Ana")["id"]
    response = client.patch(
        f"/tickets/{ticket_id}", json={"action": "notify"}, headers=a_headers
    )
    assert response.status_code == 401

    status = client.get(f"/tickets/{ticket_id}").json()
    assert status["status"] == "WAITING"