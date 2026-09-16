from sqlmodel import Session, select

from .core.db import engine, init_db
from .models import Restaurant
from .services.auth import hash_pin

PILOT_RESTAURANTS = [
    ("La Terraza Azul", "la-terraza-azul-pe", "PE", "Marisquería y terraza frente al puerto", "111333"),
    ("Cuatro Vientos", "cuatro-vientos-pe", "PE", "Cocina criolla de siempre en el centro de Lima", "222555"),
    ("Casa Mediterránea", "casa-mediterranea-cl", "CL", "Sabores del Mediterráneo junto al mar", "333666"),
]


def seed() -> None:
    init_db()
    with Session(engine) as session:
        existing = {r.slug: r for r in session.exec(select(Restaurant)).all()}
        for name, slug, country_code, description, pin in PILOT_RESTAURANTS:
            if slug not in existing:
                session.add(
                    Restaurant(
                        name=name,
                        slug=slug,
                        country_code=country_code,
                        description=description,
                        pin_code_hash=hash_pin(pin),
                    )
                )
            else:
                # Keep reseeding in sync with the demo tuples (name/description);
                # the PIN hash is only written on insert.
                restaurant = existing[slug]
                restaurant.name = name
                restaurant.country_code = country_code
                restaurant.description = description
        session.commit()


if __name__ == "__main__":
    seed()