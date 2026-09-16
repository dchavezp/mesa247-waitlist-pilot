from test_guest import auth_headers, join


def test_notify_then_seat_is_a_valid_flow(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    ticket_id = join(client, slug, "Ana")["id"]

    notified = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}, headers=headers)
    assert notified.status_code == 200
    assert notified.json()["status"] == "NOTIFIED"

    seated = client.patch(f"/tickets/{ticket_id}", json={"action": "seat"}, headers=headers)
    assert seated.status_code == 200
    assert seated.json()["status"] == "SEATED"


def test_notify_is_idempotent(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    ticket_id = join(client, slug, "Ana")["id"]

    first = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}, headers=headers)
    second = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}, headers=headers)
    assert first.status_code == second.status_code == 200


def test_host_queue_notified_at_is_utc_aware(client, make_restaurant):
    """The wire timestamp must pin its instant: naive UTC is stored (D26), the
    API serializes an explicit +00:00 offset so clients don't misread it as
    local time (U33)."""
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    ticket_id = join(client, slug, "Ana")["id"]

    client.patch(f"/tickets/{ticket_id}", json={"action": "notify"}, headers=headers)
    queue = client.get(f"/host/{slug}/queue", headers=headers).json()
    notified_at = next(item["notified_at"] for item in queue if item["id"] == ticket_id)
    assert notified_at is not None
    assert notified_at.endswith("+00:00")


def test_cannot_seat_a_ticket_that_was_never_notified(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    ticket_id = join(client, slug, "Ana")["id"]

    response = client.patch(f"/tickets/{ticket_id}", json={"action": "seat"}, headers=headers)
    assert response.status_code == 409


def test_terminal_statuses_are_immutable(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    seated_id = join(client, slug, "Ana")["id"]
    cancelled_id = join(client, slug, "Bruno")["id"]
    no_show_id = join(client, slug, "Carla")["id"]

    client.patch(f"/tickets/{seated_id}", json={"action": "notify"}, headers=headers)
    client.patch(f"/tickets/{seated_id}", json={"action": "seat"}, headers=headers)
    client.patch(f"/tickets/{cancelled_id}", json={"action": "cancel"}, headers=headers)
    client.patch(f"/tickets/{no_show_id}", json={"action": "no_show"}, headers=headers)

    for ticket_id in (seated_id, cancelled_id, no_show_id):
        for action in ("notify", "seat", "cancel", "no_show"):
            response = client.patch(
                f"/tickets/{ticket_id}", json={"action": action}, headers=headers
            )
            assert response.status_code == 409


def test_transition_on_unknown_ticket_returns_404(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    response = client.patch("/tickets/unknown-id", json={"action": "notify"}, headers=headers)
    assert response.status_code == 404


def test_queue_is_reindexed_after_seat(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")
    third = join(client, slug, "Carla")

    client.patch(f"/tickets/{first['id']}", json={"action": "notify"}, headers=headers)
    client.patch(f"/tickets/{first['id']}", json={"action": "seat"}, headers=headers)

    # Live queue first, then the day's history: the seated card stays with its chip.
    queue = client.get(f"/host/{slug}/queue", headers=headers).json()
    assert [item["id"] for item in queue] == [second["id"], third["id"], first["id"]]
    assert [item["status"] for item in queue] == ["WAITING", "WAITING", "SEATED"]
    assert [item["position"] for item in queue[:2]] == [1, 2]

    # The guest view agrees: second moved from position 2 to 1.
    status = client.get(f"/tickets/{second['id']}").json()
    assert status["position"] == 1


def test_queue_is_reindexed_after_cancel(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    tickets = [join(client, slug, f"Guest {i}") for i in range(4)]
    client.patch(f"/tickets/{tickets[1]['id']}", json={"action": "cancel"}, headers=headers)

    # Active cards reindex to 1..3; the cancelled card trails as history with its chip.
    queue = client.get(f"/host/{slug}/queue", headers=headers).json()
    assert [item["position"] for item in queue[:3]] == [1, 2, 3]
    assert queue[3]["status"] == "CANCELLED"
    assert queue[3]["id"] == tickets[1]["id"]


def test_queue_is_reindexed_after_no_show(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    tickets = [join(client, slug, f"Guest {i}") for i in range(3)]
    client.patch(f"/tickets/{tickets[0]['id']}", json={"action": "no_show"}, headers=headers)

    queue = client.get(f"/host/{slug}/queue", headers=headers).json()
    assert [item["position"] for item in queue[:2]] == [1, 2]
    assert queue[2]["status"] == "NO_SHOW"
    assert queue[2]["id"] == tickets[0]["id"]


def test_host_queue_keeps_terminal_tickets_with_status(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    seated = join(client, slug, "Ana")
    waiting = join(client, slug, "Bruno")
    client.patch(f"/tickets/{seated['id']}", json={"action": "notify"}, headers=headers)
    client.patch(f"/tickets/{seated['id']}", json={"action": "seat"}, headers=headers)

    queue = client.get(f"/host/{slug}/queue", headers=headers).json()
    assert [item["id"] for item in queue] == [waiting["id"], seated["id"]]
    assert queue[1]["status"] == "SEATED"


def test_host_info_requires_authentication(client, make_restaurant):
    slug = make_restaurant().slug
    assert client.get(f"/host/{slug}").status_code == 401
    info = client.get(f"/host/{slug}", headers=auth_headers(client, slug)).json()
    assert info == {"slug": slug, "name": "Test Place", "description": None}


def test_reorder_accepts_only_a_permutation_of_active_ids(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")
    third = join(client, slug, "Carla")

    response = client.post(
        f"/host/{slug}/queue/reorder",
        json={"order": [third["id"], first["id"], second["id"]]},
        headers=headers,
    )
    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [third["id"], first["id"], second["id"]]
    assert [item["position"] for item in response.json()] == [1, 2, 3]

    missing_id = client.post(
        f"/host/{slug}/queue/reorder",
        json={"order": [first["id"], second["id"]]},
        headers=headers,
    )
    assert missing_id.status_code == 409

    unknown_id = client.post(
        f"/host/{slug}/queue/reorder",
        json={"order": [first["id"], second["id"], "unknown-id"]},
        headers=headers,
    )
    assert unknown_id.status_code == 409


def test_day_report_counts_the_pilot_numbers(client, make_restaurant):
    slug = make_restaurant().slug
    headers = auth_headers(client, slug)
    seated = join(client, slug, "Ana")
    cancelled = join(client, slug, "Bruno")
    join(client, slug, "Carla")

    client.patch(f"/tickets/{seated['id']}", json={"action": "notify"}, headers=headers)
    client.patch(f"/tickets/{seated['id']}", json={"action": "seat"}, headers=headers)
    client.patch(f"/tickets/{cancelled['id']}", json={"action": "cancel"}, headers=headers)

    report = client.get(f"/host/{slug}/report", headers=headers).json()
    # All counts are people, not groups (U31): every join here is a party of 2.
    assert report == {
        "joined": 6,
        "seated": 2,
        "left_without_seat": 2,
        "no_show": 0,
        "avg_wait_minutes": 0,
    }