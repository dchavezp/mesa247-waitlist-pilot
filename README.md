# Mesa247 — Fila de espera digital

Prueba técnica fullstack: un MVP de cola de espera digital. El comensal se
une a la cola escaneando el QR de la puerta; el anfitrión gestiona la cola
desde una tablet. Corte deliberado para el piloto: aviso in-app en lugar de
WhatsApp, short polling (5 s) en vez de websockets, sin drag & drop pesado.
El análisis de cortes y decisiones vive en `nota_tecnica_mesa247.md` y
`docs/mapeo-conversaciones.md`.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Backend | FastAPI, SQLModel (SQLAlchemy), SQLite (default) o MySQL por env, PyJWT (auth PIN), uv, pytest |
| Frontend | Vite, React 19, TypeScript, Tailwind CSS v4 (tokens `@theme`), TanStack Query v5, TanStack Router v1 (rutas por archivos), React Hook Form + Zod, Base UI (headless), qrcode.react, input-otp |
| Tooling | Turborepo (monorepo), pnpm, oxlint, flake8 |

Monorepo con una API y **dos frontends separados** (T17/D56): `apps/server`
(API), `apps/web-guest` (flujo comensal) y `apps/web-host` (tablet del
anfitrión), más `packages/shared` con lo común (cliente API, types,
componentes, tokens del tema). Los comandos unificados del root usan Turborepo
(`pnpm dev`, `pnpm seed`, ...) y cada app conserva sus comandos nativos.

## Requisitos

- Python 3.12+ y [uv](https://docs.astral.sh/uv/) (gestor del backend)
- Node.js 20+ y pnpm 11 (`corepack enable` o `npm i -g pnpm`)

## Levantar en 5 minutos

```sh
# 1. Clonar y entrar
git clone https://github.com/dchavezp/mesa247-waitlist-pilot.git
cd mesa247-waitlist-pilot

# 2. Instalar dependencias (backend + frontend)
pnpm install
uv sync --project apps/server

# 3. Crear la base y sembrar 3 locales demo (idempotente)
pnpm seed

# 4. Levantar backend (:8000) + comensal (:5173) + anfitrión (:5174) juntos
pnpm dev
```

Listo:

- **Comensal** → `http://localhost:5173/join/la-terraza-azul-pe` (o el QR en
  la vista anfitrión). El turno queda en "Tus turnos" y sobrevive al cierre
  del navegador (8 h).
- **Anfitrión** → `http://localhost:5174/host/la-terraza-azul-pe`, login PIN
  (los dos frontends sirven del mismo backend; cada uno en su propio origen de
  producción y, por diseño, la app del comensal no incluye la sesión del host).

Locales demo y PINs del seed:

| Local | Slug | PIN |
| --- | --- | --- |
| La Terraza Azul | `la-terraza-azul-pe` | `111333` |
| Cuatro Vientos | `cuatro-vientos-pe` | `222555` |
| Casa Mediterránea | `casa-mediterranea-cl` | `333666` |

Verificación rápida: `curl http://localhost:8000/health` → `{"status":"ok","database":true}`.

> La base por defecto es SQLite en `apps/server/mesa247.db`; para MySQL copia
> `apps/server/.env.example` a `./apps/server/.env` y configura
> `DATABASE_URL`. Las tablas se crean solas al arrancar (sin migraciones en
> el piloto). Si algo se rompe: `pnpm clean` borra la base y repite el seed.

## Despliegue con Docker

Imágenes y compose listos en la raíz para correr el piloto completo con un
comando (requiere Docker):

```sh
docker compose up --build
```

- **Comensal** → `http://localhost:5173/join/la-terraza-azul-pe`
- **Anfitrión** → `http://localhost:5174/host/la-terraza-azul-pe` (PIN `111333`)
- **API/health** → `http://localhost:8000/health`

Los puertos son los mismos del dev a propósito: CORS del backend y
`VITE_API_BASE_URL` default funcionan sin tocar nada. El servidor usa SQLite
en un volumen (`server-data`) y siembra los 3 locales demo en cada arranque
(seed idempotente).

Knobs del compose (con sus defaults):

| Variable | Default | Qué controla |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:////data/mesa247.db` | Origen de datos; MySQL vía `mysql+pymysql://...` |
| `JWT_SECRET` | `dev-secret-mesa247-cambiar-en-produccion` | Firma de los JWT del host — cambiar en producción |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Origen del API que compilan las web (build-time) |

> `VITE_API_BASE_URL` es **build-time**: Vite lo embebe en el bundle. Si el
> API no va a quedar en `http://localhost:8000` desde el navegador, rebuildeá
> con `docker compose build --build-arg VITE_API_BASE_URL=https://...`.

## Comandos

Turborepo desde la raíz:

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Backend (:8000) + comensal (:5173) + anfitrión (:5174) juntos |
| `pnpm dev:server` / `pnpm dev:web-guest` / `pnpm dev:host` | Solo una app |
| `pnpm seed` | Crea tablas + 3 locales demo (idempotente) |
| `pnpm test` | Tests backend (pytest) |
| `pnpm build` | Typecheck + build de producción (ambas apps) |
| `pnpm lint` | flake8 (server) + oxlint (web-guest y web-host) |
| `pnpm clean` | Borra `mesa247.db` |

Equivalentes por app (si preferís no usar Turbo):

```sh
cd apps/server
uv run uvicorn app.main:app --reload --port 8000   # dev server
uv run python -m app.seed                          # seed
uv run pytest                                      # tests

cd apps/web-guest   # o apps/web-host
pnpm dev                                           # dev server :5173 (guest) / :5174 (host)
pnpm build                                         # tsc -b && vite build
```

Frontend: el cliente vive en `packages/shared` (`@mesa247/shared`) y apunta a
`VITE_API_BASE_URL ?? 'http://localhost:8000'` (ver `.env.example`). No hay
proxy Vite: CORS del backend ya permite `http://localhost:5173` y
`http://localhost:5174`. Cada app inyecta su estrategia de sesión vía
`createApiClient({ getToken?, onUnauthorized? })` — el guest no adjunta token;
el host adjunta el JWT y limpia la sesión ante un 401 con token.

## Contrato API

Base URL: `http://localhost:8000`. Todas las rutas menos `/host/{slug}/login`
están **sin prefijo**. Las rutas anfitrión (y `PATCH /tickets/{id}`) exigen
`Authorization: Bearer <jwt>` del login; sin token, mal token o token de otro
local → `401`.

### Endpoints

| Método | Ruta | Auth | Body | Respuesta |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | — | — | `{status, database}` |
| `GET` | `/join/{slug}` | — | — | `{slug, name, description}` |
| `POST` | `/join/{slug}` | — | `{customer_name, phone_number, party_size}` | `201` `{id, position}` |
| `GET` | `/tickets/{ticket_id}` | — | — | `{id, status, position, estimated_minutes}` |
| `POST` | `/tickets/{ticket_id}/no-show` | — | — | `{id, status, position, estimated_minutes}` |
| `POST` | `/host/{slug}/login` | — | `{pin}` | `{access_token, token_type, expires_in}` |
| `GET` | `/host/{slug}` | Bearer | — | `{slug, name, description}` |
| `GET` | `/host/{slug}/queue` | Bearer | — | `[{id, customer_name, party_size, status, position, estimated_minutes, notified_at}]` |
| `PATCH` | `/tickets/{ticket_id}` | Bearer | `{action}` | `{id, status, position, estimated_minutes}` |
| `POST` | `/host/{slug}/queue/reorder` | Bearer | `{order: [ids]}` | `[{id, customer_name, party_size, status, position, estimated_minutes, notified_at}]` |
| `GET` | `/host/{slug}/report` | Bearer | — | `{joined, seated, left_without_seat, no_show, avg_wait_minutes}` |

### Semántica

- **Estados** (`QueueStatus`): `WAITING → NOTIFIED → SEATED`, más `CANCELLED`
  y `NO_SHOW`. Un ticket debe estar `NOTIFIED` antes de `SEATED`; los estados
  terminales (`SEATED`/`CANCELLED`/`NO_SHOW`) son inmutables → `409`.
- **Transiciones del host** (`PATCH /tickets/{id}`): `action` en
  `notify | seat | cancel | no_show`.
- **Ya no voy del comensal** (`POST /tickets/{id}/no-show`): es `NO_SHOW`,
  no `CANCELLED` (ese lo reserva el anfitrión). El comensal "posee" el turno
  por su UUID.
- **Posición** siempre contigua (1..N), reindexada al sentar/cancelar/no-show.
- **Reorder**: acepta únicamente una permutación de los ids activos del local
  → `409` en cualquier otro caso (último write gana; la tablet resincroniza
  en el próximo poll).
- **Errores**: `404` local/turno no encontrado, `401` auth inválida,
  `409` transición/reorder inválido. Los `detail` están en español.

Ejemplo de punta a punta con curl:

```sh
# Comensal entra
curl -X POST http://localhost:8000/join/la-terraza-azul-pe \
  -H 'content-type: application/json' \
  -d '{"customer_name":"Ana","phone_number":"+51999999999","party_size":2}'
# {"id":"<uuid>","position":1}

# Host loguea y obtiene token
TOKEN=$(curl -s -X POST http://localhost:8000/host/la-terraza-azul-pe/login \
  -H 'content-type: application/json' -d '{"pin":"111333"}' | jq -r .access_token)

# Cola en vivo
curl http://localhost:8000/host/la-terraza-azul-pe/queue \
  -H "Authorization: Bearer $TOKEN"
```

## Estructura

```
apps/
  server/            FastAPI + SQLModel (app/api → services → models → core)
  web-guest/         React + Vite — comensal (/, /join/:slug, /tickets/:id)
  web-host/          React + Vite — anfitrión (/host/:slug, login PIN)
packages/
  shared/            @mesa247/shared: cliente API, types, componentes, tokens, queryClient
docs/
  PRD.md             Producto (qué/para quién)
  roadmap.md         Plan de trabajo por tareas (T1–T17, chequeado de a una)
  mapeo-conversaciones.md   Decision log = entregable 3 (qué decidimos y qué no)
  convenciones.md    Convenciones de código
  arquitectura.md    Reglas de capas (solo el backend)
nota_tecnica_mesa247.md    Entrega técnica (entregable 1)
entregable-4.md            Algo que construí yo (entregable 4) — qué corté, qué salió mal, qué haría distinto
prueba-fullstack-mesa247-pages-dev.md   El brief del examen (fuente de verdad del scope)
```

## Cómo se construyó (flujo con el agente)

Este repo se construyó con **OpenCode + Gentle AI** como agente asistente,
con la persona al timón de cada decisión:

1. **Fuente**: el brief (`prueba-fullstack-mesa247-pages-dev.md`) y la nota
   técnica fijan el alcance; `docs/roadmap.md` organiza el trabajo en tareas
   pequeñas (T1–T17), una a la vez, aprobadas antes de implementar.
2. **Planificación**: cada tarea arranca con preguntas de producto/tecnología
   (4 forks iniciales: BD local, polling, estilos, tests) y termina con una
   fila en `docs/mapeo-conversaciones.md` (decisión + alternativas rechazadas).
3. **Implementación**: el orquestador delega la tarea a un sub-agente con su
   skill correspondiente. Las skills de este repo (en `.agents/skills/`) cubren
   los stacks usados: `fastapi`, `tanstack-query`, `tanstack-router`,
   `react-hook-form`, `zod-4`, `tailwind-design-system`, `vercel-react-best-practices`,
   más skills globales como `impeccable` (diseño de UI/UX) y las de SDD
   (`sdd-*`: explore → propose → spec → design → tasks → apply → verify).
4. **Memoria y contexto**: Google Engram persiste decisiones entre sesiones y
   CodeGraph indexa el código para respuestas estructurales sin leer archivo
   por archivo. Lo durable vive en `docs/`, no solo en memoria.
5. **Verificación**: tests pytest por batch (`31 passed`), build/lint verdes,
   y `T12` cierra con verificación punta a punta local.

Regla de oro repetida en todo el proceso: el agente propone y ejecuta, la
persona decide. Cada corte (WhatsApp, DnD pesado, admin de locales, reporte
por e-mail) es deliberado y está documentado con su porqué.