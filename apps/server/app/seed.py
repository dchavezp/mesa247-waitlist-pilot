from sqlmodel import Session, select

from .core.db import engine, init_db
from .models import Restaurant
from .services.auth import hash_pin

PILOT_RESTAURANTS = [
    ("La Terraza Azul", "la-terraza-azul-pe", "PE", "1111"),
    ("Cuatro Vientos", "cuatro-vientos-pe", "PE", "2222"),
    ("Casa Mediterránea", "casa-mediterranea-cl", "CL", "3333"),
]


def seed() -> None:
    init_db()
    with Session(engine) as session:
        existing_slugs = set(session.exec(select(Restaurant.slug)).all())
        for name, slug, country_code, pin in PILOT_RESTAURANTS:
            if slug not in existing_slugs:
                session.add(
                    Restaurant(
                        name=name,
                        slug=slug,
                        country_code=country_code,
                        pin_code_hash=hash_pin(pin),
                    )
                )
        session.commit()


if __name__ == "__main__":
    seed()