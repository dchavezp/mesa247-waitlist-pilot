# AGENTS.md

## What this repo is

Prueba técnica Mesa247: digital waitlist MVP (guest joins a queue via QR, host
manages it on a tablet). Delivery is evaluated on **what got cut and why**, not
completeness — do not gold-plate. The road map is the work contract: one task
at a time, approved by the user (`docs/roadmap.md`).

## Layout

- `apps/server/` — FastAPI + SQLModel backend (uv-managed, Python 3.12)
- `apps/web-guest/` — React + TS + Vite **comensal**: `/`, `/join/:slug`, `/tickets/:id` (dev :5173)
- `apps/web-host/` — React + TS + Vite **anfitrión tablet**: `/host/:slug` con login PIN (dev :5174)
- `packages/shared/` — `@mesa247/shared`: cliente API (`createApiClient`), types del contrato, componentes UI, `queryClient`, tokens del `@theme` (`styles/tokens.css` — source única, ambas apps la importan). Consumido como TS fuente (sin build/dist).
- `docs/` — product and process docs (see below)
- `nota_tecnica_mesa247.md` — delivery artifact (architectural note)
- `prueba-fullstack-mesa247-pages-dev.md` — the exam brief (source of truth for scope)

Docs map (all in Spanish): `docs/PRD.md` (product, what/for-whom), `docs/roadmap.md`
(task plan, check off as you go), `docs/mapeo-conversaciones.md` (decision log =
delivery artifact #3; **update it on every decision**, including rejected
alternatives), `docs/convenciones.md` (code conventions), `docs/arquitectura.md`
(layer rules).

## Commands (run from `apps/server/`)

```sh
uv run uvicorn app.main:app --port 8000   # dev server
uv run python -m app.seed                 # seed 3 pilot restaurants (idempotent)
uv run pytest                             # backend tests (roadmap T5)
uv add <pkg>          # adds dep + updates uv.lock
uv add --dev <pkg>    # dev dep
```

Frontend commands (run from `apps/web-guest/` or `apps/web-host/`, package manager is **pnpm**):

```sh
pnpm dev              # dev server on :5173 (guest) or :5174 (host); backend CORS allows both
pnpm build            # tsc -b && vite build; regenerates src/routeTree.gen.ts
pnpm add <pkg>        # adds dep + updates pnpm-lock.yaml
pnpm add -D <pkg>     # dev dep
```

Root: `pnpm dev` (turbo) boots server + BOTH web apps. `pnpm dev:web-guest`, `pnpm dev:host`, `pnpm dev:server` boot one each. Shared code changes live in `packages/shared/` and hot-reload in both apps — never duplicate client/types/components/tokens between apps (D56).

## Frontend facts an agent would otherwise guess wrong

- **Stack**: Vite + React 19 + TS, Tailwind **v4** (no config file — theming via CSS
  `@theme` in `packages/shared/src/styles/tokens.css`, imported by both apps),
  TanStack Query v5, TanStack **Router** v1 (file-based routes in each app's
  `src/routes/`, `src/routeTree.gen.ts` is plugin-generated — never edit by
  hand, re-run `pnpm dev`/`pnpm build` after route changes), React Hook Form v7 (D28),
  **Base UI** primitives (`@base-ui/react`, headless — D32).
- **API client** lives in `packages/shared/src/api/`: `createApiClient({ getToken?, onUnauthorized? })`
  returns the `request<T>` fn; `types.ts` mirrors the Pydantic schemas in
  `apps/server/app/api/schemas.py` — snake_case, exact field names. The guest app
  builds it without a token provider (its bundle never contains host session
  code, D56); the host app injects `getHostToken`/`clearHostSession` and only a
  401 that arrived with a token clears the session. `ApiError` (status + Spanish
  `detail` from FastAPI) is exported from `@mesa247/shared`.
- **Base URL**: each app reads its own Vite env and passes it to the client —
  `createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })` in each
  `apps/*/src/api/*.ts`. `packages/shared` owns the dev default
  `'http://localhost:8000'` and **never reads `import.meta.env`** (it is plain TS
  with no Vite build; that's why each app's tsconfig declares
  `types: ["vite/client"]` and the shared tsconfig does not). The backend routes
  are **unprefixed** (`/join/{slug}`, etc.), so there is intentionally **no Vite
  proxy** — the client talks to the API origin directly and CORS allows
  `http://localhost:5173` (guest) and `http://localhost:5174` (host).
- **Polling**: the 5 s short-poll (D2) lives in `apps/web-guest/src/features/ticket/useTicketStatus.ts`
  and `apps/web-host/src/hooks/useHostQueue.ts` as `refetchInterval: 5_000`; the QueryClient defaults
  (shared in `packages/shared/src/queryClient.ts`) are retry 3 + exponential backoff (cap 30 s) + staleTime 5 s.
- **Ticket persistence (T8, D38)**: `apps/web-guest/src/features/ticket/ticketStorage.ts` keeps
  turns in localStorage (`mesa247.tickets.v1`) with an **8 h TTL** from join; `/`
  lists them as live "Tus turnos" cards (`SavedTicketCard`, polling per card).
  Entries are removed on terminal status (SEATED/CANCELLED/NO_SHOW). Guest "Ya no
  voy" calls `POST /tickets/{id}/no-show` → NO_SHOW (D24) with a Base UI
  `AlertDialog` confirm (`LeaveTicketButton`); the route/ticket data updates from
  cache, no extra poll. Re-opening a saved id never extends the TTL. The host JWT
  lives in `apps/web-host/src/features/host/hostSession.ts` (`mesa247.host-session.v1`)
  — different app, and its code never ships to the guest (D56).
- **Conventions** (D29, `docs/convenciones.md`): custom components in
  `packages/shared/src/components/` (no UI libraries), SOLID on components/hooks, theme tokens via
  `@theme` in `tokens.css` (never hardcoded values), validations with **Zod** +
  `zodResolver` from React Hook Form (zod + @hookform/resolvers are installed).
- **Tailwind sources**: the `@import "tailwindcss"` lives in
  `packages/shared/src/styles/tokens.css`, outside each Vite root, so Tailwind's
  automatic detection would never see component code. Each app's `src/index.css`
  declares its sources explicitly (`@source "../src"` and
  `@source "../../../packages/shared/src"`). Do NOT re-add per-app copies of
  shared components to "fix" missing styles — that is what D56 forbids.

## Backend facts an agent would otherwise guess wrong

- DB: **SQLite by default** at `apps/server/mesa247.db`; MySQL via `DATABASE_URL`
  in `.env` (`mysql+pymysql://...`). SQLModel abstracts both (decision D8).
- Tables auto-create on startup (FastAPI lifespan → `init_db()`); no migrations
  in the pilot (D14 — Alembic deferred to real production).
- **Layered architecture** (`docs/arquitectura.md`, D19): `api/routes` (thin
  routers + Pydantic schemas) → `services/` (business rules, transactions) →
  `models.py` (SQLModel entities) → `core/` (`config.py` DIP + `db.py` engine).
  Dependencies flow downward only; routers never touch SQLAlchemy directly.
- `QueueStatus` is an enum (`WAITING | NOTIFIED | SEATED | CANCELLED | NO_SHOW`);
  a ticket must be `NOTIFIED` before it can be `SEATED`.
- Position index is contiguous (1..N), reindexed after seat/cancel/no-show;
  reorder is last-write-wins on the full ordered ID list (D3).
- Host API (T4, D24–D26): `PATCH /tickets/{id}` takes `{action: notify|seat|cancel|no_show}`
  — terminal statuses (SEATED/CANCELLED/NO_SHOW) are immutable → 409.
  `POST /host/{slug}/queue/reorder` accepts ONLY a permutation of the restaurant's
  active ids → 409 otherwise (tablet resyncs on next poll). `GET /host/{slug}/report`
  returns the 5 pilot numbers (`joined, seated, left_without_seat, no_show,
  avg_wait_minutes`) scoped to the **UTC day** (no per-restaurant TZ in the pilot).
  All `/host/*` routes except `POST /host/{slug}/login`, plus `PATCH /tickets/{id}`,
  require `Authorization: Bearer <jwt>` from login (T15, D40): no/wrong/expired tokens
  get 401, and a token only works for its own restaurant (`require_host_for` scopes
  by slug; ticket transitions are scoped by the ticket's restaurant).
- Guest self-service "Ya no voy" (T8, D38): `POST /tickets/{id}/no-show` → NO_SHOW
  (guest-leave is NOT CANCELLED — that's a host action). Reuses the same transition
  matrix; a guest "knows" a ticket by its unguessable UUID id.
- Client polling must be short polling (5–8 s), not websockets/SSE (D2).

## Conventions

- **Comments** (D13): code explains itself; comments only for the non-obvious
  *why* (tradeoffs, gotchas, external constraints). No commented-out code, no
  docstrings that repeat the signature. See `docs/convenciones.md`.
- **Frontend** (D29): custom components in `src/components/`, SOLID, Tailwind
  theme via `@theme`, validations with Zod + `zodResolver` — same doc.
- Every product/architecture decision → new row in `docs/mapeo-conversaciones.md`
  with rejected alternatives. Persistence lives in project docs, **not engram**.

## Gotchas

- Editor must use `apps/server/.venv/bin/python` as interpreter or
  `pydantic_settings` imports fail to resolve (fixed in `.vscode/settings.json`).
- `mesa247.db` is generated; safe to delete and recreate via seed.
- `.atl/` is **gitignored** local agent tooling (skill registry cache); keep it
  out of version control — it stays on disk for this machine only.
- Frontend: React StrictMode double-mounts effects in dev; the TanStack Router
  vite plugin regenerates `routeTree.gen.ts` only on dev/build runs — a route file
  added without one of those breaks `tsc`.
- No `opencode.json` in the repo; global OpenCode config applies.
- Repo is already published at `github.com/dchavezp/mesa247-waitlist-pilot`
  (branch `main`, one initial commit + follow-ups). T13 delivery still requires
  granting `talento@mesa247.pe` access to the repo and finishing the final docs.