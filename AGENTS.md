# AGENTS.md

## What this repo is

Prueba técnica Mesa247: digital waitlist MVP (guest joins a queue via QR, host
manages it on a tablet). Delivery is evaluated on **what got cut and why**, not
completeness — do not gold-plate. The road map is the work contract: one task
at a time, approved by the user (`docs/roadmap.md`).

## Layout

- `apps/server/` — FastAPI + SQLModel backend (uv-managed, Python 3.12)
- `apps/web/` — React + TS + Vite frontend, **NOT scaffolded yet** (roadmap T6+)
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

Frontend commands appear once `apps/web` is scaffolded (T6).

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
- Client polling must be short polling (5–8 s), not websockets/SSE (D2).

## Conventions

- **Comments** (D13): code explains itself; comments only for the non-obvious
  *why* (tradeoffs, gotchas, external constraints). No commented-out code, no
  docstrings that repeat the signature. See `docs/convenciones.md`.
- Every product/architecture decision → new row in `docs/mapeo-conversaciones.md`
  with rejected alternatives. Persistence lives in project docs, **not engram**.

## Gotchas

- Editor must use `apps/server/.venv/bin/python` as interpreter or
  `pydantic_settings` imports fail to resolve (fixed in `.vscode/settings.json`).
- `mesa247.db` is generated; safe to delete and recreate via seed.
- `.atl/` is **gitignored** local agent tooling (skill registry cache); keep it
  out of version control — it stays on disk for this machine only.
- No `opencode.json` in the repo; global OpenCode config applies.
- Repo is already published at `github.com/dchavezp/mesa247-waitlist-pilot`
  (branch `main`, one initial commit + follow-ups). T13 delivery still requires
  granting `talento@mesa247.pe` access to the repo and finishing the final docs.