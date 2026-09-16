def join(client, slug, name, party_size=2):
    response = client.post(
        f"/join/{slug}",
        json={
            "customer_name": name,
            "phone_number": "999888777",
            "party_size": party_size,
        },
    )
    assert response.status_code == 201
    return response.json()


def login(client, slug, pin="111111"):
    response = client.post(f"/host/{slug}/login", json={"pin": pin})
    assert response.status_code == 200
    return response.json()["access_token"]


def auth_headers(client, slug, pin="111111"):
    return {"Authorization": f"Bearer {login(client, slug, pin)}"}


def test_pilot_restaurants_are_seeded(seed_restaurants, client):
    pins = {
        "la-terraza-azul-pe": "AZUL24",
        "cuatro-vientos-pe": "VIENT4",
        "casa-mediterranea-cl": "MEDIT6",
    }
    for slug in ("la-terraza-azul-pe", "cuatro-vientos-pe", "casa-mediterranea-cl"):
        assert (
            client.get(f"/host/{slug}/queue", headers=auth_headers(client, slug, pins[slug])).status_code
            == 200
        )


def test_join_assigns_contiguous_positions(client, make_restaurant):
    slug = make_restaurant().slug
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")
    third = join(client, slug, "Carla", party_size=4)
    fourth = join(client, slug, "Diego")

    assert [first["position"], second["position"], third["position"], fourth["position"]] == [
        1,
        2,
        3,
        4,
    ]


def test_ticket_status_reports_live_position(client, make_restaurant):
    slug = make_restaurant().slug
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")

    status = client.get(f"/tickets/{second['id']}").json()
    assert status["position"] == 2
    assert status["status"] == "WAITING"
    # No seating history yet: fall back to the default minutes-per-group (D20).
    assert status["estimated_minutes"] == 10


def test_join_unknown_restaurant_returns_404(client):
    response = client.post(
        "/join/does-not-exist",
        json={"customer_name": "Ana", "phone_number": "999888777", "party_size": 2},
    )
    assert response.status_code == 404


def test_join_rejects_invalid_payload(client, make_restaurant):
    slug = make_restaurant().slug
    base = {"customer_name": "Ana", "phone_number": "999888777", "party_size": 2}

    empty_name = {**base, "customer_name": ""}
    zero_party = {**base, "party_size": 0}
    assert client.post(f"/join/{slug}", json=empty_name).status_code == 422
    assert client.post(f"/join/{slug}", json=zero_party).status_code == 422


def test_ticket_status_unknown_ticket_returns_404(client):
    assert client.get("/tickets/unknown-id").status_code == 404


def test_guest_no_show_leaves_the_queue(client, make_restaurant):
    slug = make_restaurant().slug
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")

    response = client.post(f"/tickets/{first['id']}/no-show")
    assert response.status_code == 200
    assert response.json()["status"] == "NO_SHOW"

    # The guest view agrees: second moved from position 2 to 1.
    status = client.get(f"/tickets/{second['id']}").json()
    assert status["position"] == 1

    queue = client.get(f"/host/{slug}/queue", headers=auth_headers(client, slug)).json()
    assert [item["id"] for item in queue] == [second["id"]]


def test_guest_no_show_on_terminal_ticket_returns_409(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    seated_id = join(client, slug, "Ana")["id"]
    client.patch(f"/tickets/{seated_id}", json={"action": "notify"}, headers=headers)
    client.patch(f"/tickets/{seated_id}", json={"action": "seat"}, headers=headers)

    assert client.post(f"/tickets/{seated_id}/no-show").status_code == 409


def test_guest_no_show_unknown_ticket_returns_404(client):
    assert client.post("/tickets/unknown-id/no-show").status_code == 404