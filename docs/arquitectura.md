# Arquitectura por Capas — Mesa247 Waitlist

> Decisión D19 (`docs/mapeo-conversaciones.md`). Se eligió **capas** en
> lugar de arquitectura limpia/hexagonal: esas agregan ceremonia (puertos,
> adaptadores, casos de uso) pensada para equipos grandes que coordinan
> contratos. Este proyecto es chico y de un solo dev: lo que importa es
> dirección de dependencia unidireccional, testabilidad y cero fricción.

## Capas

```
HTTP (FastAPI)
   │
   ▼
api/          → Presentación: routers delgados + schemas Pydantic (contratos)
   │
   ▼
services/     → Aplicación: reglas de negocio y transacciones
   │
   ▼
models.py     → Datos: entidades SQLModel (esquema de BD)
   │
   ▼
core/         → Infraestructura: config (DIP) + engine/session
```

## Reglas (dependencia descendente, nunca hacia arriba)

- **api/**: valida entradas (schemas), llama a services, serializa la
  respuesta. **Nunca** toca SQLAlchemy directo ni contiene lógica de negocio.
- **services/**: únicas dueñas de las reglas de negocio (estados, reindex,
  LWW, estimación de espera) y de las transacciones. No saben de HTTP.
- **models.py**: entidades puras de datos; no importan de api ni services.
- **core/**: `config.py` (única fuente de verdad, DIP — nadie lee env aparte)
  y `db.py` (engine y session).

## Consecuencia práctica

- Los tests golpean a la API con `TestClient` **o** a los services directo:
  la lógica se testea sin HTTP.
- Agregar un endpoint = router delgado + método de service, sin tocar el
  resto (Open/Closed en la práctica).
- Un import viola la regla si sube de capa: e.g. `services` importando
  `api/schemas` o `api/routes` tocando `models` para hacer queries.