from test_guest import join


def test_notify_then_seat_is_a_valid_flow(client, make_restaurant):
    slug = make_restaurant().slug
    ticket_id = join(client, slug, "Ana")["id"]

    notified = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"})
    assert notified.status_code == 200
    assert notified.json()["status"] == "NOTIFIED"

    seated = client.patch(f"/tickets/{ticket_id}", json={"action": "seat"})
    assert seated.status_code == 200
    assert seated.json()["status"] == "SEATED"


def test_notify_is_idempotent(client, make_restaurant):
    slug = make_restaurant().slug
    ticket_id = join(client, slug, "Ana")["id"]

    first = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"})
    second = client.patch(f"/tickets/{ticket_id}", json={"action": "notify"})
    assert first.status_code == second.status_code == 200


def test_cannot_seat_a_ticket_that_was_never_notified(client, make_restaurant):
    slug = make_restaurant().slug
    ticket_id = join(client, slug, "Ana")["id"]

    response = client.patch(f"/tickets/{ticket_id}", json={"action": "seat"})
    assert response.status_code == 409


def test_terminal_statuses_are_immutable(client, make_restaurant):
    slug = make_restaurant().slug
    seated_id = join(client, slug, "Ana")["id"]
    cancelled_id = join(client, slug, "Bruno")["id"]
    no_show_id = join(client, slug, "Carla")["id"]

    client.patch(f"/tickets/{seated_id}", json={"action": "notify"})
    client.patch(f"/tickets/{seated_id}", json={"action": "seat"})
    client.patch(f"/tickets/{cancelled_id}", json={"action": "cancel"})
    client.patch(f"/tickets/{no_show_id}", json={"action": "no_show"})

    for ticket_id in (seated_id, cancelled_id, no_show_id):
        for action in ("notify", "seat", "cancel", "no_show"):
            response = client.patch(f"/tickets/{ticket_id}", json={"action": action})
            assert response.status_code == 409


def test_transition_on_unknown_ticket_returns_404(client):
    response = client.patch("/tickets/unknown-id", json={"action": "notify"})
    assert response.status_code == 404


def test_queue_is_reindexed_after_seat(client, make_restaurant):
    slug = make_restaurant().slug
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")
    third = join(client, slug, "Carla")

    client.patch(f"/tickets/{first['id']}", json={"action": "notify"})
    client.patch(f"/tickets/{first['id']}", json={"action": "seat"})

    queue = client.get(f"/host/{slug}/queue").json()
    assert [item["position"] for item in queue] == [1, 2]
    assert [item["id"] for item in queue] == [second["id"], third["id"]]

    # The guest view agrees: second moved from position 2 to 1.
    status = client.get(f"/tickets/{second['id']}").json()
    assert status["position"] == 1


def test_queue_is_reindexed_after_cancel(client, make_restaurant):
    slug = make_restaurant().slug
    tickets = [join(client, slug, f"Guest {i}") for i in range(4)]
    client.patch(f"/tickets/{tickets[1]['id']}", json={"action": "cancel"})

    queue = client.get(f"/host/{slug}/queue").json()
    assert [item["position"] for item in queue] == [1, 2, 3]


def test_queue_is_reindexed_after_no_show(client, make_restaurant):
    slug = make_restaurant().slug
    tickets = [join(client, slug, f"Guest {i}") for i in range(3)]
    client.patch(f"/tickets/{tickets[0]['id']}", json={"action": "no_show"})

    queue = client.get(f"/host/{slug}/queue").json()
    assert [item["position"] for item in queue] == [1, 2]


def test_host_queue_excludes_terminal_tickets(client, make_restaurant):
    slug = make_restaurant().slug
    seated = join(client, slug, "Ana")
    waiting = join(client, slug, "Bruno")
    client.patch(f"/tickets/{seated['id']}", json={"action": "notify"})
    client.patch(f"/tickets/{seated['id']}", json={"action": "seat"})

    queue = client.get(f"/host/{slug}/queue").json()
    assert [item["id"] for item in queue] == [waiting["id"]]


def test_reorder_accepts_only_a_permutation_of_active_ids(client, make_restaurant):
    slug = make_restaurant().slug
    first = join(client, slug, "Ana")
    second = join(client, slug, "Bruno")
    third = join(client, slug, "Carla")

    response = client.post(
        f"/host/{slug}/queue/reorder",
        json={"order": [third["id"], first["id"], second["id"]]},
    )
    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [third["id"], first["id"], second["id"]]
    assert [item["position"] for item in response.json()] == [1, 2, 3]

    missing_id = client.post(
        f"/host/{slug}/queue/reorder", json={"order": [first["id"], second["id"]]}
    )
    assert missing_id.status_code == 409

    unknown_id = client.post(
        f"/host/{slug}/queue/reorder",
        json={"order": [first["id"], second["id"], "unknown-id"]},
    )
    assert unknown_id.status_code == 409


def test_day_report_counts_the_pilot_numbers(client, make_restaurant):
    slug = make_restaurant().slug
    seated = join(client, slug, "Ana")
    cancelled = join(client, slug, "Bruno")
    join(client, slug, "Carla")

    client.patch(f"/tickets/{seated['id']}", json={"action": "notify"})
    client.patch(f"/tickets/{seated['id']}", json={"action": "seat"})
    client.patch(f"/tickets/{cancelled['id']}", json={"action": "cancel"})

    report = client.get(f"/host/{slug}/report").json()
    assert report == {
        "joined": 3,
        "seated": 1,
        "left_without_seat": 1,
        "no_show": 0,
        "avg_wait_minutes": 0,
    }