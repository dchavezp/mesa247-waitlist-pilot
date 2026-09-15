# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Comensal (walk-in)**: en la puerta del restaurante, con datos móviles (el
  wifi del local es malo), sin querer bajar una app. Quiere saber cuánto falta
  y no perder su turno.
- **Anfitrión**: tablets compartidas en la entrada; los viernes hay dos
  atendiendo a la vez. Prioriza clientes frecuentes y llama mesas.
- **Gerente del local**: quiere el reporte del día: cuánta gente se fue sin
  sentarse y por qué.

## Product Purpose

Digitalizar la lista de espera de restaurantes con mucho walk-in (colas de 30–40
personas anotadas en un cuaderno). El comensal entra a la cola escaneando un QR
(solo nombre, teléfono y cuántos son), ve su posición y tiempo estimado en su
celular; el anfitrión gestiona la cola desde una tablet; al cierre, un reporte
muestra la gente que se fue sin sentarse. Piloto en 3 locales en 3 semanas.

## Positioning

Una cola digital que el comensal opera **sin app y desde el QR del local**:
espera en vivo en el celular del propio comensal (aviso in-app, no WhatsApp),
y el anfitrión controla la puerta desde una tablet compartida. El piloto mide
si baja la gente que se va sin avisar y si el anfitrión recupera el control.

## Operating Context

- Comensal: celular en la puerta, datos móviles, red inestable → vistas
  livianas, mobile-first, polling corto (5–8 s, no websockets), tolerancia a
  cortes con retry.
- Anfitrión: tablet compartida en la entrada, dos a la vez → vista responsive,
  reorden last-write-wins (2 tablets pueden chocar), acciones rápidas en vez de
  drag & drop.
- Reporte: conteos diarios por local (unidos, sentados, sin sentarse, no
  vinieron, espera media, pico de cola).

## Capabilities and Constraints

- Formulario `/join/{slug}` (nombre, teléfono, comensales) → ticket con
  posición; posición en vivo con polling; aviso "tu mesa está lista" in-app;
  cola del anfitrión con llamar/sentar/cancelar/priorizar; reporte del día.
- Slug = marca + país (`la-terraza-azul-pe`, `casa-mediterranea-cl`); el país
  del local define el prefijo telefónico fijo del form (`+51`/`+56`).
- Contrato backend: `phone_number` suelto ≤20; el form es mobile-first.
- Piloto: sin login de anfitriones (tablets compartidas; seguridad por PIN
  como T14–T16), sin WhatsApp API (aviso in-app), seed de los 3 locales, sin
  migraciones (tablas auto-create).
- **Tema base dark para todo el producto** (decisión del usuario, 2026-09-15):
  el rediseño actual lo define; host/report heredan el mismo tema.

## Brand Commitments

- Nombre del producto: **Mesa247**. Voz neutral en español para el comensal y
  el anfitrión.
- Constraint voluntario del usuario: **tema dark** como base del producto,
  orientado a restaurantes.
- Preferencia de dirección (registrada 2026-09-15): **canon de categoría** —
  el estándar del sector ejecutado con oficio: dark neutral con acento cálido,
  cards redondeadas, tipo de sistema workhorse, sin ironía ni giros raros. La
  barra de acabado la fijan los productos con los que debe sentarse:
  OpenTable/Resy, Starbucks app, Toast POS y pases de abordaje de aerolíneas.

## Evidence on Hand

- `prueba-fullstack-mesa247-pages-dev.md` — brief del examen (fuente de truth
  de scope).
- `nota_tecnica_mesa247.md` — entregable 1 (arquitectura, cortes, modelo).
- `docs/PRD.md`, `docs/roadmap.md`, `docs/mapeo-conversaciones.md`,
  `docs/convenciones.md`, `docs/arquitectura.md` — decisiones y plan.
- Código: backend FastAPI en `apps/server/`, frontend React en `apps/web/`.
- No hay logotipos, fotos de restaurantes ni assets de marca verificados.

## Product Principles

1. Lo que no se construye se corta con razón: el piloto evalúa "qué se cortó y
   por qué", no completitud.
2. Mobile-first para el comensal: liviano, tolerante a cortes de red, sin
   webfonts que pesen en datos móviles.
3. El anfitrión controla la puerta: acciones rápidas, sin drag & drop, la mesa
   se llama y el comensal confirma en la app.
4. Los datos del día deciden: el reporte cierra el ciclo del piloto.
5. Consistencia del sistema: decisiones globales (tema, tokens, componentes)
   viven una sola vez y se heredan.

## Accessibility & Inclusion

- Form y estados accesibles (Base UI headless + ARIA en componentes custom);
  contraste y targets táctiles mobile-first.