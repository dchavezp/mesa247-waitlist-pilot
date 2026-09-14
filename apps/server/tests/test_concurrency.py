from concurrent.futures import ThreadPoolExecutor
from threading import Barrier


def test_simultaneous_joins_never_share_a_position(client, make_restaurant):
    slug = make_restaurant().slug
    n_guests = 10
    barrier = Barrier(n_guests)

    def join_guest(guest_number):
        barrier.wait()
        response = client.post(
            f"/join/{slug}",
            json={
                "customer_name": f"Guest {guest_number}",
                "phone_number": "999888777",
                "party_size": 2,
            },
        )
        return response.status_code, response.json().get("position")

    with ThreadPoolExecutor(max_workers=n_guests) as pool:
        results = list(pool.map(join_guest, range(1, n_guests + 1)))

    statuses, positions = zip(*results)
    assert all(status == 201 for status in statuses)
    assert len(positions) == len(set(positions))
    assert sorted(positions) == list(range(1, n_guests + 1))