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

- [x] **T14. Auth PIN: modelo + login JWT** (la deuda D31 entra al piloto — D33)
  - `pin_code` en `Restaurant` guardado como **hash** (nunca texto plano); seed con PIN por local.
  - `POST /host/{slug}/login` → valida PIN → JWT de sesión corta (secreto + expiración en config, dev default).

- [x] **T15. Proteger rutas anfitrión + tests de auth**
  - Dependency `require_host` (Bearer JWT) en `/host/*` y en `PATCH /tickets/{id}` → 401 sin/mal token.
  - Tests pytest: PIN incorrecto → 401, sin token → 401, token válido → 200, acciones de host sin auth rechazadas.

## Fase 2 — Frontend

- [x] **T6. Scaffold Vite + React + TS + Tailwind + TanStack Query + TanStack Router + React Hook Form**
  - `apps/web/` con cliente API tipado (espejo de los schemas Pydantic), QueryClient con polling 5 s + retry con backoff, ruteo por archivos y formularios listos para T7.
  - Stack ampliado (U16): **Base UI** (`@base-ui/react`, primitivas headless — D32) + theme tokens `@theme` (D30).

- [x] **T7. Vista comensal — Unirse** (`/join/:slug`)
  - Formulario (nombre, teléfono, comensales) → crea ticket → navega al turno.

- [x] **T8. Vista comensal — Tu turno** (`/tickets/:id`)
  - Posición en vivo (baja al avanzar la cola), tiempo estimado, botón "Ya no voy",
    banner prominente cuando llega el llamado (reemplazo in-app del WhatsApp, D1).
  - Persistencia local (U22 → D38): el turno queda en **"Tus turnos"** (localStorage)
    y sobrevive al cierre del navegador; se limpia al sentarse/cancelar y expira a
    las 8 h desde el join. "Ya no voy" del comensal = `POST /tickets/{id}/no-show` → NO_SHOW.

- [ ] **T16. Login tablet (PIN)**
  - `/host/:slug` arranca con pantalla de PIN; token guardado y enviado como `Authorization` en `client.ts`; 401 → vuelve al login.

- [ ] **T9. Vista anfitrión** (`/host/:slug`, detrás del login T16)
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

- El corte original T14 (host sin auth por slug) **ya no aplica**: la seguridad
  por PIN entró al alcance del piloto (U17 → D33) como T14–T16.
- Los demás cortes deliberados (WhatsApp, DnD pesado, admin de locales, reporte
  por e-mail) viven en la nota técnica §2.

## Estimación (actualizada)

| Batch | Tiempo |
|-------|--------|
| T1–T3 (setup + comensal) | ~1 h |
| T4–T5 (anfitrión + tests) | ~1 h |
| T6–T9 (frontend) | ~1 h 30 m |
| T14–T16 (seguridad PIN) | ~30 m |
| T10–T12 (cierre + verificación) | ~30 m |
| T13 (entrega) | ~30 m |

**Total: ~4 h 30 m** — la nota técnica ya contaba el auth por PIN dentro de sus
4 h; el roadmap anterior lo subestimaba al omitir estas tareas.