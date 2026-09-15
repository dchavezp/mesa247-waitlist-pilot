---
name: Mesa247
description: Dark warm-neutral waitlist terminal where join and turn are one card that becomes a boarding pass.
colors:
  surface: "oklch(0.22 0.012 60)"
  surface-raised: "oklch(0.27 0.015 60)"
  ink: "oklch(0.95 0.01 80)"
  ink-muted: "oklch(0.7 0.02 70)"
  line: "oklch(0.35 0.016 65)"
  brand: "oklch(0.72 0.135 70)"
  brand-strong: "oklch(0.66 0.135 70)"
  brand-soft: "oklch(0.3 0.03 70)"
  on-brand: "oklch(0.21 0.012 60)"
  success: "oklch(0.72 0.11 150)"
  success-soft: "oklch(0.29 0.035 150)"
  warning: "oklch(0.72 0.12 80)"
  warning-soft: "oklch(0.31 0.03 80)"
  danger: "oklch(0.72 0.15 25)"
  danger-soft: "oklch(0.28 0.045 25)"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.428
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.428
  caption:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.333
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "10": "40px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.brand-strong}"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  field-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Mesa247

## Overview

**Creative North Star: "The Boarding Pass"**

The guest flow owns the wait as a calm, confident ticket: one dark operating surface where join and turn are the same physical object — a card that becomes a boarding pass the moment it is issued. A walk-in guest scans the QR at the door, joins in under ten seconds, and from that moment holds a ticket that always tells the truth: your number, your place, how long until the bell. When the host calls them, the ticket itself warms up and says it.

The system is the canon of the category played straight (craft bar: Toast POS, airline boarding pass, Starbucks app, OpenTable/Resy): deep warm-neutral dark grounds that never tip blue-gray, one warm amber accent spent sparingly, 1px hairlines, gently rounded cards, a workhorse system sans, and exactly one authored motion moment. It refuses the generic light SaaS form and the glowing-nightlife dark cliché both — no gradient text, no glow, no neon, no webfont. Density is low and centered: every surface is one card per viewport, and the guest believes it within one viewport.

**Key Characteristics:**
- One physical object: the join card is the stub; the turn view is the boarding pass it becomes (same shell, same tear line, same `max-w-sm` column).
- One warm accent, spent only on the primary action ("Unirse") and the NOTIFIED moment ("¡Tu mesa está lista!").
- Warm-neutral dark grounds (hue 60–80) throughout; ink is a high-contrast warm white; status hues are desaturated to keep the board quiet.
- Boarding-pass anatomy: a giant turn number, a dashed tear line, and a "Fila virtual — Mesa247" footer.
- One two-layer contact-plus-ambient shadow per card, in warm black; everything else is flat.
- Max one authored animation per surface, reduced-motion safe; system sans only; Spanish copy everywhere visible.

## Colors

A warm dark palette: every neutral carries hue 60–80 so the dark reads as ember-lit interior, never blue-gray; ONE warm amber accent carries the entire brand load; status colors sit muted alongside.

### Primary
- **The Warm Amber** (oklch(0.72 0.135 70)): the only brand accent. Spent on the primary button ("Unirse"), the NOTIFIED headline and card border, `::selection`, the caret in inputs, and every focus ring. Its rarity is the point.
- **The Deep Amber** (oklch(0.66 0.135 70)): hover state of the primary button; also the hover border of the secondary button.
- **The Ember Ground** (oklch(0.3 0.03 70)): defined in the theme as a soft brand ground and carried by the token ramp; no shipped surface exercises it yet (reserved for inheriting host/report surfaces).
- **The Ink-on-Amber** (oklch(0.21 0.012 60)): text on the amber — a near-surface dark that keeps the primary button legible without adding a second hue.

### Neutral
- **Warm Ground** (oklch(0.22 0.012 60)): the page surface (`bg-surface`), input fill, and skeleton blocks. The whole dark world starts here.
- **Raised Warm Ground** (oklch(0.27 0.015 60)): one step lighter; every card (`bg-surface-raised`), secondary-button fill, skeleton caption bar.
- **Warm White Ink** (oklch(0.95 0.01 80)): all primary text; maximum contrast on the dark grounds.
- **Muted Warm Ink** (oklch(0.7 0.02 70)): secondary text, placeholders, the ticket footer, demoted terminal numbers.
- **Warm Hairline** (oklch(0.35 0.016 65)): every 1px border and dashed tear line at rest.

### Semantic (muted, terminal only)
- **Warm Green** (oklch(0.72 0.11 150)): the SEATED moment only ("¡Buen provecho!").
- **Warm Red** (oklch(0.72 0.15 25)): form errors (field + form-level) and the invalid input border.
- **The Soft Ramps** (`*-soft` at oklch lightness 0.28–0.31, same hue): defined in the theme alongside `warning` (oklch(0.72 0.12 80)); no shipped surface uses `warning` or any soft token yet — they are reserved for the inheriting host/report surfaces, not dead weight.

### Named Rules
**The One Warm Accent Rule.** The amber is spent only on the primary action and the NOTIFIED moment. Any surface shows it on a handful of elements — primary button, focus rings, selection, and the called-ticket. Its rarity is the point; a second accent hue never enters the guest flow.

**The Warm Ground Rule.** Every neutral token carries hue 60–80. A dark surface that reads blue-gray (hue ~240) is off-world; if a new surface needs a darker or lighter ground, step lightness on the same warm hue, never borrow a cool neutral.

## Typography

**Display Font:** ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
**Body Font:** same system stack (no distinct body face)
**Label/Mono Font:** none — no webfont, no mono (PRD §4.3: the guest is on mobile data at the door).

**Character:** The system stack, played at weight 500–600 with tight tracking on the big numbers. Cost zero, load zero, and the type disappears so the number and the copy — Spanish, neutral — own the surface. Semibold at 88px is the only typographic theatrics the system allows.

### Hierarchy
- **Display** (600, 5.5rem/88px, line-height 1, tracking -0.025em): the giant turn number. `text-[5.5rem]` exists ONLY for the position in WAITING and NOTIFIED states.
- **Headline** (600, 1.5rem/24px, line-height 1.333, tracking -0.025em): card titles — "Únete a la fila", "¡Tu mesa está lista!", "¡Buen provecho!".
- **Title** (600, 1.25rem/20px, line-height 1.4): terminal-state headlines ("Tu turno fue cancelado", "No pudimos encontrarte") and the error card ("No pudimos cargar tu turno").
- **Subhead** (500, 1.125rem/18px, line-height 1.555): the WAITING status line — "Esperas en la posición {n}".
- **Body** (400, 0.875rem/14px, line-height 1.428): explanatory copy under headings, form-level errors, feedback paragraphs. Muted ink when it explains; ink when it confirms.
- **Label** (500, 0.875rem/14px, line-height 1.428): field labels ("Nombre", "Teléfono", "Comensales").
- **Caption** (400, 0.75rem/12px, line-height 1.333): the ticket footer — "Fila virtual" / "Mesa247".

### Named Rules
**The One Sans Rule.** System stack only, everywhere. No webfont ever joins the guest flow; the Product Principle is mobile data at the door, and the stack is the entire type budget.

**The Giant Turn Number Rule.** The display grade belongs to the live position and nothing else. The moment the wait is over, the number demotes to 36px muted ink — the ticket stops claiming the stage once it has told the truth (terminal demotion is `text-4xl` at 2.25rem/36px, leading-none, `text-ink-muted`).

## Layout

One centered card per viewport: `min-h-dvh` flex center, page gutter `px-4` (16px), vertical breathing `py-10` (40px), card column capped at `max-w-sm` (384px). The card is the stage; nothing competes with it. Inside the card the rhythm is a tight 4/6/24: subtext offsets `mt-1`/`mt-1.5` (4/6px), headline offset after the turn number `mt-6` (24px), field gap `space-y-5` (20px), card padding `px-6` (24px) with the form body at `py-5` (20px). The dashed tear line runs `mx-6` (24px) so it never touches the card edges. Every shipped surface is mobile-first single-column; no breakpoint utilities appear in the guest flow, so layouts must survive at 320px and inherit upward unchanged.

## Elevation & Depth

Flat surfaces, one two-layer shadow per card — **The Contact-Plus-Ambient Shadow**: `0 1px 2px oklch(0.1 0.015 60 / 0.4), 0 12px 32px oklch(0.06 0.01 60 / 0.45)` (token `--shadow-card`). The tight layer grounds the card; the wide layer lifts it; all offsets and both colors are warm black at the surface hue, so the shadow never reads as a cool cloud. No glow, no neon, no gradient — depth is carried entirely by this one shadow applied to every card and by the single raised-surface step (`surface-raised` vs `surface`).

### Named Rules
**The No-Glow Rule.** The shadow vocabulary is exactly one token. Nothing blooms: no colored shadows, no halos, no inset glows, no gradient surfaces. If a card needs more lift, it gets lightness, not light.

## Shapes

Radius grows with scale, and the build settles it: controls and inputs are gently curved at 8px (`rounded-lg`), the loading block at 12px (`rounded-xl`), cards at 16px (`rounded-2xl`). Every border is 1px, in the Warm Hairline at rest. The recurring signature is the **dashed tear line** — a 1px `border-dashed` in `line` that separates header from form on the join card and number from footer on the turn ticket; it is the perforation that makes the two cards one physical object. The NOTIFIED moment swaps the resting border for the amber (`border-brand`), warming the ticket's edge when the host calls the table.

## Components

### Buttons
- **Shape:** gently curved (8px radius).
- **Primary:** amber fill (`brand`), near-surface dark text (`on-brand`), padding 8px 16px, `font-medium`. Full-width in the guest flow ("Unirse", "Reintentar").
- **Hover:** deepens to `brand-strong`; color transition only (`transition-colors`).
- **Focus:** none outline; 2px amber ring with a 2px `surface`-colored offset gap.
- **Disabled:** `opacity-60`.
- **Secondary:** raised ground fill, ink text, 1px hairline border that warms to `brand-strong` on hover — the quiet counterpart, drafted for host surfaces.

### Cards / Containers
- **Corner Style:** gently curved (16px radius).
- **Background:** raised warm ground (`surface-raised`), one step above the page.
- **Shadow Strategy:** the single two-layer contact-plus-ambient shadow, always.
- **Border:** 1px hairline at rest; the amber border replaces it only on the NOTIFIED turn ticket.
- **Internal Padding:** 24px (`px-6`), form bodies 20px (`py-5`).
- **Anatomy (the signature):** header → dashed tear line → body → dashed tear line → footer ("Fila virtual" / "Mesa247", 12px muted, justify-between).

### Inputs / Fields
- **Style:** 1px hairline border, 8px radius, `surface` fill, ink text, muted placeholders, 8px 12px padding. Labels above, 14px medium.
- **Focus:** input border warms to amber + 2px amber ring with `surface` offset; grouped inputs (phone) warm the whole group border via `focus-within`; the caret is amber.
- **Error:** field error text in Warm Red below the control; invalid state turns the input/group border red (`border-danger`). Form-level API errors render as a `role="alert"` paragraph in Warm Red above the submit button; in-flight submit copy is "Uniéndose…".
- **Phone field:** fixed country prefix (`+51`/`+56`, derived from the slug) in a bordered addon sharing one group border with the input — a single-ticket pattern, not two stacked boxes.

### The Turn Ticket (signature component)
The boarding pass. WAITING: giant amber-free 88px number, status line, "~N min restantes" or "En breve". NOTIFIED: the card warms — amber border plus the `ticket-warm` animation (0.7s exponencial ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, opacity 0.55→1 with a 0.985→1 scale), and the headline itself turns amber: "¡Tu mesa está lista!". Terminal states (SEATED "¡Buen provecho!" in green, CANCELLED, NO_SHOW) demote the number and stay flat and calm, telling the truth without drama. Loading shows a skeleton of `surface` blocks with the built-in pulse; failure shows the error card with a full-width retry.

### Named Rules
**The Single-Motion Rule.** One authored animation exists in the system: `ticket-warm`, and it plays only on the NOTIFIED moment. The reduced-motion media query kills it; new surfaces inherit the rule — no new keyframes without a motion guard.

## Do's and Don'ts

### Do:
- **Do** keep every neutral on the warm hue band (60–80) — step lightness, never cool hue, when a surface needs darker or lighter.
- **Do** spend the amber only on the primary action and the NOTIFIED moment; keep the rest of the card ink-on-warm-ground.
- **Do** build every guest surface as ONE centered card (`max-w-sm`) with the dashed 1px tear line separating regions.
- **Do** use the giant display grade only for the live turn number, and demote it (36px, muted) the moment the status turns terminal.
- **Do** use the system sans stack at 400–600 weight and Spanish copy; keep every visible string in Spanish.
- **Do** guard every authored animation with `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** use blue-gray dark surfaces, cool neutrals, or a cool accent — the world is warm ember, not nightlife.
- **Don't** add gradients, glow, neon, blur, or a second shadow token; `--shadow-card` is the entire depth vocabulary.
- **Don't** load a webfont, an icon font, or any asset the guest must pay for on mobile data.
- **Don't** add a second accent hue to the guest flow; success is reserved for the SEATED moment, danger for errors.
- **Don't** hardcode colors, radii, or spacing outside the `@theme` tokens in `src/index.css`; host and report surfaces inherit this system.
- **Don't** add new authored keyframes without a reduced-motion guard; `ticket-warm` is the only authored motion moment.