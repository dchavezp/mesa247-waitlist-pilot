# Roadmap — Prueba Técnica Mesa247

> Plan de trabajo por tareas, una a la vez. Cada tarea es un batch
> pequeño, verificable y defendible. Orden = dependencias.

## Fase 0 — Setup

- [x] **T1. Scaffold backend (uv + FastAPI skeleton)**
  - `apps/server/` con `pyproject.toml` (uv), `app/` con config, db engine,
    `/health` y CORS para dev. Corre con un comando y se verifica con un curl.

## Fase 1 — Backend core

- [x] **T2. Modelos + seed de los 3 locales**
  - SQLModel: `Restaurant` y `QueueEntry` (schema de la nota técnica).
  - Script de seed: La Terraza Azul (PE), Cuatro Vientos (PE), Casa Mediterránea (CL).

- [x] **T3. Endpoints comensal**
  - `POST /join/{slug}` (nombre, teléfono, comensales) → entra a la cola, devuelve ticket + posición.
  - `GET /tickets/{id}` → posición en vivo y tiempo estimado (lo que pollea el frontend).

- [x] **T4. Endpoints anfitrión**
  - `GET /host/{slug}/queue` → cola ordenada con tiempos.
  - `PATCH /tickets/{id}` → transiciones: llamar (WAITING→NOTIFIED), sentar (→SEATED), cancelar (→CANCELLED), ya no voy (→NO_SHOW).
  - `POST /host/{slug}/queue/reorder` → reordenar (last-write-wins, D3).
  - `GET /host/{slug}/report` → conteos del día (se unieron/sentaron/fueron sin sentarse/no vinieron).

- [x] **T5. Tests pytest (lo que importa)**
  - Unirse a la cola asigna posición contigua.
  - Reindexado al sentar/cancelar (la cola no deja huecos).
  - Transiciones válidas/inválidas (no sentar un ticket que no fue llamado).
  - Concurrencia: dos joins simultáneos no comparten posición.

## Fase 2 — Frontend

- [x] **T6. Scaffold Vite + React + TS + Tailwind + TanStack Query + TanStack Router + React Hook Form**
  - `apps/web/` con cliente API tipado (espejo de los schemas Pydantic), QueryClient con polling 5 s + retry con backoff, ruteo por archivos y formularios listos para T7.

- [ ] **T7. Vista comensal — Unirse** (`/join/:slug`)
  - Formulario (nombre, teléfono, comensales) → crea ticket → navega al turno.

- [ ] **T8. Vista comensal — Tu turno** (`/tickets/:id`)
  - Posición en vivo (baja al avanzar la cola), tiempo estimado, botón "Ya no voy",
    banner prominente cuando llega el llamado (reemplazo in-app del WhatsApp, D1).

- [ ] **T9. Vista anfitrión** (`/host/:slug`)
  - Cola en vivo, llamar/sentar/cancelar, priorizar (frecuente), modal con QR de la puerta.

## Fase 3 — Cierre y entrega

- [ ] **T10. Reporte del día en web + endpoint ya listo**
  - Vista simple de cierre con los 5 números del prototipo.

- [ ] **T11. README 5 minutos + contrato API**
  - Levantar backend + frontend + seed en 5 min; tabla de endpoints.

- [ ] **T12. Verificación punta a punta local**
  - Flujo completo: comensal se une → anfitrión ve → llama → comensal responde → sentar.
  - Tests verdes, README validado desde cero.

- [ ] **T13. Entrega: repo + conversaciones + nota final**
  - Commit inicial, repo en GitHub con acceso a talento@mesa247.pe.
  - `docs/mapeo-conversaciones.md` completado con los chats reales por parte.
  - Nota técnica revisada + diez líneas del entregable 4.

---

## Pendiente post-piloto (cortes deliberados)

- [ ] **T14. Seguridad y acceso a la vista de anfitrión** (no se construye en el piloto)
  - Hoy el acceso es por slug (`/host/{slug}`): **obscuridad, no seguridad** —
    cualquiera con el link gestiona la cola (asumido en PRD §4.2: tablets
    compartidas, confianza del local; ver D31).
  - Pendiente para Fase 2: PIN por local, enlace de acceso con expiración o
    login — a decidir cuando haya multi-local real.

## Estimación (actualizada)

| Batch | Tiempo |
|-------|--------|
| T1–T3 (setup + comensal) | ~1 h |
| T4–T5 (anfitrión + tests) | ~1 h |
| T6–T9 (frontend) | ~1 h 30 m |
| T10–T12 (cierre + verificación) | ~30 m |
| T13 (entrega) | ~30 m |

**Total: ~4 h** — consistente con la nota técnica.