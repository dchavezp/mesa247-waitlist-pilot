# Mapeo de Conversaciones — Prueba Técnica Mesa247

> **Entregable 3**: tus conversaciones con la IA. Este documento es el índice
> vivo de la conversación: qué decidimos, qué preguntaste, qué rechazamos y por
> qué. Se completa con los chats reales por parte (nota, backend, frontend)
> como anexo al entregar.

## Resumen ejecutivo

Comencé con la nota técnica ya redactada (corte de producto: aviso in-app en
vez de WhatsApp, short polling, sin drag & drop pesado) y el encargo del
diseñador como única fuente. A partir de ahí trabajamos así:

1. **Preguntas primero, código después**: definimos 4 forks de tecnología
   (BD local, polling del frontend, estilos, tests) antes de escribir una línea.
2. **Roadmap por tareas**: rechacé hacer todo de una — cada batch se aprueba,
   se implementa y se verifica de a uno (T1–T13, `docs/roadmap.md`).
3. **Documentación en el proyecto**: el decision log, el PRD, las convenciones
   y la arquitectura viven en `docs/` — nada queda solo en memoria del chat.
4. **Estado actual**: T1 (scaffold), T2 (modelos + seed), T3 (endpoints
   comensal) y T4 (endpoints anfitrión) completos y verificados; T5 (tests) pendiente.

**Quién lleva el timón**: el candidato. Cada decisión de producto, tecnología
y convención la tomó la persona; la IA propuso y ejecutó según lo aprobado.

## El timón (intervenciones del candidato)

| # | Fecha | Qué dijo / decidió | Impacto |
|---|-------|--------------------|---------|
| U1 | 2026-09-14 | "No es necesario usar engram, con documentación en el proyecto está bien" | Persistencia en `docs/`, no en memoria externa |
| U2 | 2026-09-14 | "Quiero que me hagas preguntas en cuanto a elección de tecnologías" | 4 forks resueltos antes de codear (D8–D11) |
| U3 | 2026-09-14 | "SOLID para la implementación" + regla de comentarios | D7 y D13 (`docs/convenciones.md`) |
| U4 | 2026-09-14 | "Me gustaría dividir por task, si tenemos un roadmap sería mejor" | Roadmap T1–T13, trabajo de a uno |
| U5 | 2026-09-14 | "¿Tengo Python instalado?" / warning de `pydantic_settings` en el editor | Verificación de entorno; fix de intérprete en `.vscode/settings.json` |
| U6 | 2026-09-14 | "Vamos a incluir que esto está enfocado a mobile first; tablet/desktop no cubre" | PRD §4.3 + D17 (con corrección de matiz, ver U7) |
| U7 | 2026-09-14 | "Tablet sí está contemplada para el anfitrión" | Corrección: host responsive es requisito del brief (D17 final) |
| U8 | 2026-09-14 | "Arquitectura por capas, en contraste con limpia/hexagonal (enfocadas a equipos)" | D19 + `docs/arquitectura.md` + reestructura real del código |
| U9 | 2026-09-14 | "Mejorar el histórico de conversaciones con resumen y lo que yo comento" | Este documento |

## Partes del trabajo

1. **La nota técnica** — completada (`nota_tecnica_mesa247.md`)
2. **Backend** — FastAPI (en curso: T1–T4 hechos)
3. **Frontend** — React + TypeScript (pendiente, T6+)

---

## Documentos del proyecto

| Documento | Ruta | Rol |
|-----------|------|-----|
| PRD | `docs/PRD.md` | Qué y para qué del producto (producto puro) |
| Nota técnica | `nota_tecnica_mesa247.md` | Entregable 1 — arquitectura, cortes, modelo de datos |
| Roadmap | `docs/roadmap.md` | Plan de trabajo por tareas |
| Convenciones | `docs/convenciones.md` | Reglas de código (comentarios, limpieza) |
| Arquitectura | `docs/arquitectura.md` | Capas y reglas de dependencia (D19) |
| Mapeo de conversaciones | `docs/mapeo-conversaciones.md` | Entregable 3 — decisiones, preguntas, rechazos |

## Registro de decisiones (Decision Log)

| # | Fecha | Parte | Decisión | Por qué | Alternativas rechazadas |
|---|-------|-------|----------|---------|------------------------|
| D1 | 2026-09-14 | Nota | Notificación **in-app** en vez de WhatsApp Business para el piloto | Las plantillas de Meta se rechazan y se cobran por país; el comensal ya tiene la web abierta viendo su puesto | WhatsApp API, SMS |
| D2 | 2026-09-14 | Nota | **Short polling** (5–8 s) en vez de WebSockets/SSE | Redes móviles inestables en la puerta; polling tolera cortes y reconexión; Cloud Run no favorece conexiones persistentes | WebSockets, SSE |
| D3 | 2026-09-14 | Nota | **Drag & drop simple**: botones de priorización en la tablet | Last-write-wins sobre `position_index`; dos anfitriones simultáneos | Reordenamiento complejo con DnD UI pesado |
| D4 | 2026-09-14 | Nota | Ruteo multi-tenant por **slug** (`/join/{slug}`, `/host/{slug}`) | Desacopla UI de IDs internos; escala a 150 locales | IDs directos en URL |
| D5 | 2026-09-14 | Nota | Backend **stateless**, estado solo en BD | Cloud Run escala a múltiples instancias sin estado en memoria | Estado en memoria, hilos Python |
| D6 | 2026-09-14 | Backend/Frontend | Stack: FastAPI + SQLModel + React + TypeScript (Vite) | Stack declarado por Mesa247 + velocidad de desarrollo | — |
| D7 | 2026-09-14 | Global | Principios **SOLID** en implementación | Decisión explícita del candidato | — |
| D8 | 2026-09-14 | Backend | **SQLite en local + MySQL por env var** (`DATABASE_URL`) | SQLModel abstrae el driver; README arranca en 5 min sin instalar MySQL, prod usa Cloud SQL | MySQL nativo local, solo SQLite |
| D9 | 2026-09-14 | Frontend | **TanStack Query** para el polling del puesto (refetchInterval 5 s, retry con backoff) | Caching/retry/refetch on focus gratis, robusto sobre redes malas | Hook propio `usePolling` |
| D10 | 2026-09-14 | Frontend | **Tailwind** para estilos | Iteración rápida sobre 5 pantallas, tokens consistentes | CSS puro + variables |
| D11 | 2026-09-14 | Tests | **pytest backend punta a punta** (TestClient): join, reindex, llamar/sentar/cancelar, concurrencia de posición | "Tests solo de lo que importa" — lo que se rompe es la API, no lo visual | vitest frontend |
| D12 | 2026-09-14 | Backend | Scaffold: FastAPI factory + config vía pydantic-settings + engine SQLModel sincrónico + `/health` con probe DB | Composición en `create_app()`, configuración centralizada, dev con SQLite | Config en módulos sueltos, async engine |
| D13 | 2026-09-14 | Global | Convención de comentarios: código limpio y autoexplicativo, comentarios solo para el POR QUÉ no obvio | Decisión explícita del candidato — el código se lee, no se explica | Comentarios descriptivos, docstrings por defecto |
| D14 | 2026-09-14 | Backend | Tablas vía `SQLModel.metadata.create_all` en el lifespan, seed idempotente por slug | README 5 min sin migraciones; para producción real se sumaría Alembic | Alembic desde el día 1 (prematuro para el piloto) |
| D15 | 2026-09-14 | Backend | `QueueStatus` como Enum (`WAITING, NOTIFIED, SEATED, CANCELLED, NO_SHOW`) | Contrato explícito del ciclo de vida del ticket; SQLite lo almacena como VARCHAR, MySQL como ENUM | Strings sueltos |
| D16 | 2026-09-14 | Producto | PRD creado (`docs/PRD.md`) para separar el QUÉ del CÓMO | La nota era arquitectura; faltaba la descripción de producto mapeada | Mezclar PRD dentro de la nota técnica |
| D17 | 2026-09-14 | Producto | Principio **mobile first**: comensal optimizado para celular; host responsive por exigencia del brief (tablet); sin experiencia dedicada tablet/desktop por ahora | El brief exige la tablet del anfitrión, así que "tablet no se cubre" no aplica igual a ambos lados | Declarar tablet/desktop fuera de alcance de forma absoluta |
| D18 | 2026-09-14 | Global | `AGENTS.md` creado con comandos, convenciones y gotchas del repo | Onboarding de futuras sesiones de IA sin repetir descubrimientos | Dejarlo solo en memoria/conversación |
| D19 | 2026-09-14 | Arquitectura | **Arquitectura por capas** (`docs/arquitectura.md`): `api → services → models → core`, dependencia descendente | Capas da dirección unidireccional + testabilidad con poca ceremonia; clean/hexagonal agrega puertos/adaptadores/casos de uso pensados para equipos grandes | Clean Architecture, Hexagonal |
| D20 | 2026-09-14 | Backend | Tiempo estimado = posición × promedio móvil de duración de sentados recientes (últimos 10), fallback 5 min/grupo por local configurado; recalculado en cada poll | regla del PRD §6, sin ceremonia | modelo de colas M/M/c, constante fija por local, predicción por hora del día |
| D21 | 2026-09-14 | Backend | Slug desconocido → 404 y match exacto; teléfono sin formato estricto (solo max_length 20); joins duplicados permitidos (sin dedup) | el piloto no impone topes (PRD §6) y el QR trae el slug correcto | match case-insensitive, validación con regex E.164, dedupe por teléfono |
| D22 | 2026-09-14 | Backend | Join no devuelve tiempo estimado; GET /tickets/{id} lo calcula en vivo | roadmap T3 explicita "ticket + posición" en join; el tiempo se recalcula con cada poll (D2) y no debe cachearse en el join | incluir estimated_minutes en el join response |
| D23 | 2026-09-14 | Backend | **Slug = marca + país** (ej. `casa-mediterranea-cl`), único global | un mismo restaurante puede operar en dos países (PE/CL/EC/CO); el slug único global hoy impediría la segunda sede | constraint compuesto (country_code, slug) + URL `/join/{country}/{slug}` — rompe el contrato de ruteo y complica el QR |
| D24 | 2026-09-14 | Backend | **Matriz de transiciones** vía `PATCH /tickets/{id}` con `action`: notify (WAITING→NOTIFIED, setea `notified_at`), seat (NOTIFIED→SEATED, setea `seated_at`, único camino), cancel y no_show desde cualquier estado activo; terminales (SEATED/CANCELLED/NO_SHOW) intocables → 409 | PRD §5.2 y §6 ("un ticket solo se sienta si antes fue llamado"); CANCELLED = "sin sentarse" (cancela el anfitrión), NO_SHOW = "no vinieron al llamado" (ya no voy del comensal o no-show del host) | transición por `status` directo (deja huecos de matriz), auto-cancel por timeout (rechazado por D1: decide el anfitrión) |
| D25 | 2026-09-14 | Backend | **Reporte del día = 5 números** (`joined`, `seated`, `left_without_seat`, `no_show`, `avg_wait_minutes`); el **pico de cola queda fuera del endpoint** | PRD §4.1 y roadmap T10/T12 ("los 5 números del prototipo"); el pico histórico exacto requiere un log de eventos que el esquema fijo (D14) no tiene — reconstruirlo sería inventar datos | incluir pico aproximado por max posición (inexacto tras reindexar/reordenar), log de auditoría de eventos (cambio de esquema + ceremonia, Fase 2) |
| D26 | 2026-09-14 | Backend | Reporte: "hoy" = **día UTC**; espera media = promedio join→seated (minutos) de los sentados del día; `seated_at`/`notified_at` respetan el patrón aware-UTC del modelo | el piloto no modela TZ por local (simplificación declarada en el código); D20 ya promedia `seated_at − created_at` | día por timezone del país (mapeo country_code→TZ), ventanas por hora local |

## Preguntas de tecnología al candidato (resueltas)

- [x] Base de datos local → **SQLite + MySQL por env** (D8)
- [x] Obtención de datos en frontend → **TanStack Query** (D9)
- [x] Estilos → **Tailwind** (D10)
- [x] Alcance de tests → **Backend pytest punta a punta** (D11)

## Rechazos (qué le dijimos que no a la IA)

- **No a hacer todo de una**: la IA propuso avanzar de corrido; se eligió
  roadmap por tareas con OK explícito en cada una (U4).
- **No a la persistencia externa**: la IA sugirió guardar en memoria del
  sistema (engram); el candidato pidió documentación dentro del proyecto (U1).
- **No a "tablet/desktop no se cubre" en seco**: la IA (propuesta inicial)
  declaró tablet fuera de alcance; el candidato corrigió que la tablet del
  anfitrión **sí** está contemplada (U6, U7 → D17).
- **No a comentarios descriptivos por defecto**: se impuso la regla de que el
  código se explique solo y los comentarios solo cuenten el porqué no obvio (D13).
- **No a guardar el PRD dentro de la nota técnica**: se separó producto
  (QUÉ) de arquitectura (CÓMO) (D16).
- **No a la ceremonia de clean/hexagonal**: se eligió capas por ser un corte
  chico, de un solo dev (U8 → D19).

## Supuestos

- **Entorno del evaluador**: Python 3.12+, uv y Node 20+ (verificado en local:
  Python 3.12.3, uv 0.12, Node 24). El README asume uv para levantar todo.
- **Editor**: VS Code con intérprete `apps/server/.venv/bin/python` para evitar
  el warning de `pydantic_settings` (`.vscode/settings.json`).
- **Locales del piloto**: seed de 3 restaurantes con slugs estables
  (la-terraza-azul-pe, cuatro-vientos-pe, casa-mediterranea-cl) — datos en
  `apps/server/app/seed.py`.
- **Supuestos de producto** (sin respuesta del diseñador): ver `docs/PRD.md §7`.