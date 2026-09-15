---
version: 1
slug: "routes-join-slug-tsx"
primary_target: "routes/join.$slug.tsx"
related_targets: ["routes/tickets.$id.tsx"]
---

# Surface brief — guest turn flow (join + ticket)

**Targets**: `apps/web/src/routes/join.$slug.tsx` (primary), `apps/web/src/routes/tickets.$id.tsx` (related)
**Visitor mode**: Operate — the walk-in guest at the door joins the queue and tracks their turn.

## Scope

Two surfaces of the guest turn flow, redesigned together under the product-wide dark theme:
- `/join/{slug}` — join form (name, phone with fixed country prefix, party size).
- `/tickets/{id}` — live turn view (T8 real view built here with existing `useTicketStatus` polling).

## Audience / job / action

- **Audience**: walk-in guest on mobile data at the restaurant door; also the host on a shared tablet (host routes inherit the same tokens but are not restyled in this run).
- **Job**: join the virtual queue in seconds, then know exactly where their turn stands.
- **Action**: submit the join form → land on the live turn view → stay informed until "tu mesa está lista".
- **Proof/content**: restaurant name from slug? No — backend join response returns `id` + `position`; ticket status returns `id`, `status`, `position`, `estimated_minutes`. Use `TicketStatus` data as it exists; no invented claims.
- **Constraints**: Spanish copy everywhere visible; mobile-first; no webfont (PRD §4.3 — system sans only); short-polling hook already exists (5 s, D2); Zod v4 + RHF + zodResolver already wired; tokens must stay in `src/index.css` `@theme`; no new UI library; no hardcoded colors outside tokens; keep all working behavior (join payload building with `defaultCountryCode`, error channels, navigation after join).

## Chosen direction and memorable moment

**Canon of the category, played straight** (user-pinned via standing exit, 2026-09-15). Dark neutral with warm accent, rounded cards, workhorse system sans. Craft bar set by: Toast POS, airline boarding pass, Starbucks app, OpenTable/Resy. No irony, no smuggled quirk.

Memorable moment: the turn view reads like a boarding pass — one giant turn number, clear status, warm accent on "tu mesa está lista" — and the join card reads like a host ticket. Guest believes it within one viewport.

## Unresolved decisions

- Whether the dark theme's warm accent color should be an amber/ember (food warmth) vs keeping brand terra — resolved by the writer's first render, judged in review against the craft bar.
- Ticket view states beyond WAITING (NOTIFIED/SEATED/CANCELLED/NO_SHOW): render realistically with the data available; NOTIFIED is the hero state.

## Direction contract

THESIS: The guest turn flow owns the wait as a calm, confident ticket: one dark operating surface where join and turn are the same physical object — a card that becomes a boarding pass the moment it is issued. It refuses the generic light SaaS form and the glowing-nightlife dark cliché both.

OWN-WORLD: Deep warm-neutral dark surfaces (not blue-gray), surface-raised one step lighter, ink as high-contrast warm white, one warm accent reserved for the primary action and the NOTIFIED moment, secondary hues desaturated to keep the board quiet. System sans, 1px lines, radii 12–16px, one soft elevation shadow. No gradient text, no glow, no neon.

STORY: A guest scans the QR at the door, joins in under ten seconds, and from that moment holds a ticket that always tells the truth: your number, your place, how long until the bell. When the host calls them, the ticket itself warms up and says it.

FIRST VIEWPORT (`/join/{slug}`, mobile): dark surface; one raised card centered with the join form: nombre, teléfono (fixed `+51`/`+56` addon), comensales; primary action is the warm full-width button "Unirse"; errors inline in danger tone, form-level API error above the button. Signature interaction: after submit, the card visibly hands off to the turn view — position lands instantly.

FORM: Canon of the category (user-pinned standing exit; craft bar Toast POS / boarding pass / Starbucks app / OpenTable-Resy); seed key `aa428432`.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Review workload note

Scope is a visual-only redesign of two guest surfaces + `@theme` token rewrite (dark base). No schema, API, or behavior changes; backend untouched. Estimated changed lines ~250–400.
