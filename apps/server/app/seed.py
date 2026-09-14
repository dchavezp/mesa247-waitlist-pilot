from sqlmodel import Session, select

from .core.db import engine, init_db
from .models import Restaurant

# (name, slug, country_code) — slugs incluyen el país (D23): la misma marca
# puede operar en dos países con slugs distintos y únicos globalmente.
PILOT_RESTAURANTS = [
    ("La Terraza Azul", "la-terraza-azul-pe", "PE"),
    ("Cuatro Vientos", "cuatro-vientos-pe", "PE"),
    ("Casa Mediterránea", "casa-mediterranea-cl", "CL"),
]


def seed() -> None:
    init_db()
    with Session(engine) as session:
        existing_slugs = set(session.exec(select(Restaurant.slug)).all())
        for name, slug, country_code in PILOT_RESTAURANTS:
            # Instancias frescas por llamada: reusar objetos de módulo tras un
            # commit los deja detached y rompe la idempotencia en el mismo proceso.
            if slug not in existing_slugs:
                session.add(Restaurant(name=name, slug=slug, country_code=country_code))
        session.commit()


if __name__ == "__main__":
    seed()