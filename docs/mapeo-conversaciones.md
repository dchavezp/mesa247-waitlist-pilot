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
   se implementa y se verifica de a uno (T1–T16, `docs/roadmap.md`).
3. **Documentación en el proyecto**: el decision log, el PRD, las convenciones
   y la arquitectura viven en `docs/` — nada queda solo en memoria del chat.
4. **Estado actual**: T1–T6 completos y verificados (backend completo + tests verdes + frontend scaffolded); T7 (unirse) es lo próximo.

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
| U10 | 2026-09-14 | "Vamos a incluir tanstack router, react hook form" al arrancar T6 | Stack del frontend definido: TS Router + RHF (D28) |
| U11 | 2026-09-14 | "usa pnpm no npm" | Package manager del frontend: pnpm (D28) |
| U12 | 2026-09-14 | "Incluir como coding standard: custom components, seguir SOLID, manejar el theme con tailwind, las validaciones con zod" | Convenciones de frontend documentadas + `zod` al stack (D29) |
| U13 | 2026-09-14 | Corrige la config del router plugin: API nueva `tanstackRouter({ target: 'react', autoCodeSplitting: true })` antes de `react()` | `apps/web/vite.config.ts` actualizado; build verde con code-splitting por ruta (chunk `routes-*.js`) |
| U14 | 2026-09-14 | "Hay que crear las variables para el theme de tailwindcss, puedes usar /impeccable para tener una idea" | Theme tokens en `@theme` (OKLCH, roles semánticos) — D30 |
| U15 | 2026-09-14 | "Hay que poner como pendiente la seguridad y acceso para la vista de anfitrión" | Corte documentado: T14 pendiente post-piloto (D31), PRD §4.2/§7 alineados |
| U16 | 2026-09-14 | "Hay que incluir base-ui, pnpm add @base-ui/react" | Primitivas headless al stack: **D32** (`@base-ui/react` 1.8.0) |
| U17 | 2026-09-15 | "He actualizado la nota técnica para incluir seguridad por PIN; hay que definir nuevas tareas en el roadmap" | PIN por local entra al alcance del piloto (T14–T16): reemplaza el corte D31 (D33) |
| U18 | 2026-09-15 | "Vamos por la task T7 (vista comensal — Unirse)" | T7 implementada: `/join/:slug` con form RHF+Zod, navegación al turno (D34) |
| U19 | 2026-09-15 | "Vamos a mejorar el input para el número porque por país el código puede variar, hay que incluir eso" | Teléfono con código de país, default según el slug (D35) |
| U20 | 2026-09-15 | "y no debe usar select ya debería mostrar el código como prefijo" | El código de país es **prefijo fijo** (addon de `InputGroup`), no select: el QR/slug del local ya define el país (D36) |
| U21 | 2026-09-15 | "Vamos a rediseñar las vistas de comensal (join + turno) con tema oscuro" vía /impeccable | Rediseño dark del flujo comensal: **tema base dark** para todo el producto (no un modo), canon de la categoría, barra de oficio fijada por 4 productos (D37) |
| U22 | 2026-09-15 | "Vamos por la task T8 … usar el local storage para que cuando el usuario cierre el navegador pueda volver a ver el estado … una vista … por cards. se puede limpiar una vez acepte o cancele, solo puede permanecer … 8 horas desde que se envía el ticket" | T8 completada: **persistencia local del turno**, vista "Tus turnos" por cards, TTL 8 h, cleanup al estado terminal (D38) |

## Partes del trabajo

1. **La nota técnica** — completada (`nota_tecnica_mesa247.md`)
2. **Backend** — FastAPI (en curso: T1–T4 hechos)
3. **Frontend** — React + TypeScript en `apps/web/` (T6 hecho; T7 + vista viva del turno implementados con rediseño dark, ver D37)

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
| D27 | 2026-09-14 | Tests | La prueba de concurrencia de la T5 **destapó una race real**: la asignación de posición era COUNT + INSERT sin atomicidad (10 joins simultáneos → solo 5 puestos únicos). Fix mínimo en `services/tickets.py`: `threading.Lock` en proceso alrededor de count+insert+commit | el piloto corre un solo proceso (uvicorn 1 worker); un índice global rompe porque los tickets terminales conservan posiciones históricas que colisionan con las reindexadas; el índice único parcial funciona en SQLite pero no es portable a MySQL (D8). El lock serializa solo la asignación de posición, no la cola; el comentario documenta que multi-instancia requiere mecanismo a nivel BD | índice único parcial (D8: MySQL no soporta partial indexes), UNIQUE global (colisiona con posiciones históricas), advisory lock de BD (ceremonia innecesaria en single-process) |
| D28 | 2026-09-14 | Frontend | T6 + adiciones: **TanStack Router** (file-based routing con plugin de Vite) + **React Hook Form** al stack declarado (D9–D10); package manager **pnpm**. Scaffold en `apps/web/`: cliente API tipado espejo de `api/schemas.py`, QueryClient con retry 3 + backoff exponencial (tope 30 s) y polling 5 s en los hooks `useTicketStatus`/`useHostQueue`, Tailwind **v4** (plugin oficial, sin config file) | U10/U11 explícitos; el ruteo por archivos se adapta a 5 pantallas y el RHF evita revalidar formularios a mano; pnpm es más rápido y estricto con el lockfile; Tailwind v4 es el estándar actual sin postcss config. API sin prefijo → el cliente usa `VITE_API_BASE_URL` (default `http://localhost:8000`) y CORS ya permite 5173; sin proxy para no chocar con las rutas del frontend | React Router/Next (más ceremonia), react-final-form (menos ecosistema), npm (descartado por U11), Tailwind v3 + postcss (obsoleto) |
| D29 | 2026-09-14 | Frontend | Convenciones de frontend (se suman a D13): **componentes custom** en `src/components/` (sin librerías UI), **SOLID** en componentes y hooks (SRP, OCP por props/composición, ISP en props, DIP hacia contratos tipados), **theme vía `@theme`** de Tailwind v4 (cero valores hardcodeados), **validaciones con Zod** + `zodResolver` con RHF. Se agrega `zod` + `@hookform/resolvers` al stack (`docs/convenciones.md`) | U12 explícito; coherencia con D28 (RHF) y D19 (capas: misma dirección de dependencia); zod es el estándar TS y tipa el schema | librería UI completa (shadcn/ui — ceremonia para 5 pantallas), CSS Modules/vanilla-extract (fragmentan el tema), Yup/joi (menos integración con TS) |
| D30 | 2026-09-14 | Frontend | **Theme tokens** en `@theme` (`apps/web/src/index.css`): roles semánticos en **OKLCH** — superficies (surface, surface-raised), texto (ink, ink-muted), bordes (line), acción (brand, brand-strong, brand-soft, on-brand), estados (success/warning/danger + variantes soft), `font-sans` de sistema (sin webfont) y `shadow-card`. Brand = **terracota** (hue 40) sobre neutros cálidos | U14; guía /impeccable (nuevas paletas en OKLCH, roles y no swatches, color = acción/estado no decoración); PRD §4.3 (comensal con datos móviles → nada de webfonts); parejas fg/bg chequeadas contra WCAG AA. El brand es **supuesto a validar con el diseñador** — cambiar el hue es una línea | azul SaaS genérico (sin significado para hospitalidad), monocromo puro (pierde jerarquía de estados), webfont (peso extra y FOUT en la puerta del local) |
| D31 | 2026-09-14 | Roadmap/Producto | **Seguridad de host pendiente (T14)**: la vista `/host/{slug}` queda **sin autenticación** en el piloto — acceso por slug (obscuridad, no seguridad); el corte queda registrado como tarea pendiente post-piloto en el roadmap | U15; el brief evalúa "qué se cortó y por qué" → el corte debe estar escrito; PRD §4.2 ya asumía sin login (tablets compartidas, confianza del local) — ahora el roadmap nombra la deuda | PIN por local (simple pero se comparte entre staff), enlace con expiración (sin gestión de usuarios), login completo (ceremonia para un piloto de 3 locales) |
| D32 | 2026-09-14 | Frontend | **Base UI** (`@base-ui/react` 1.8.0) al stack: primitivas *headless* (dialog, select, radio, etc.) con accesibilidad ARIA integrada y **cero estilos impuestos** — matiza D29 ("sin librerías UI"): sigue prohibido traer look de terceros, pero las primitivas de comportamiento entran; el estilo siempre lo definen componentes custom + tokens del `@theme` | U16 explícito; el modal QR del anfitrión (T9) y estados que cambian necesitan accesibilidad sin reinventar ARIA; encaja con la filosofía D29 (look propio) y con Tailwind v4 (sin runtime de estilos) | shadcn/ui (trae estilos + ceremonia de copiado, ya citado en D29), Radix UI (equivalente headless, pero el candidato eligió Base UI), MUI (estilos propios, rompería el tema) |
| D33 | 2026-09-15 | Roadmap/Backend | **Seguridad de host entra al piloto (reemplaza el corte D31)**: PIN por local + JWT de sesión corta → T14–T16. `pin_code` en `Restaurant` guardado como **hash** (nunca texto plano); `POST /host/{slug}/login` valida el PIN y emite el token; dependency `require_host` (Bearer JWT) protege `/host/*` **y `PATCH /tickets/{id}`** — cierra el vector "un comensal altera la cola" que la nota §5.1 exige; el token se comparte entre staff del local pero expira y solo opera sobre el slug autenticado | La nota técnica actualizó el alcance del MVP (U17); el PIN hasheado evita que una fuga de la BD exponga credenciales; sin gestión de usuarios (3 locales, tablets compartidas) | Sin auth (obscuridad por slug, corte original D31), enlace con expiración, login completo con usuarios, PIN en texto plano en BD |
| D34 | 2026-09-15 | Frontend | **T7 — Vista comensal "Unirse" implementada**: ruta `/join/:slug` (file-based, mobile-first) con formulario RHF + `zodResolver` — schema Zod v4 en scope de módulo que **espeja el contrato backend** `JoinRequest` (teléfono suelto por D21, `party_size` ≥ 1); submit llama `joinQueue()` y navega a `/tickets/$id`. Componentes custom extraídos por D29: `Field` (label+input+error, ARIA con `useId`) y `Button` (variants primary/secondary). Errores de API en estado local (los resolvers Zod limpian `setError('root')`). `/tickets/$id` queda como **placeholder mínimo** que T8 reemplaza con la vista viva (polling 5 s) | U18; PRD §4.1/§4.3 (mobile first, datos móviles); D29/D30 (componentes custom, tokens, Zod en el borde) | Form en la ruta sin componentes (rompe D29 al repetir markup 3×), validación estricta de teléfono en frontend (contradice D21), `setError('root')` para el error de red (fragile con zodResolver), construir T8 completa ahora (fuera del batch T7) |
| D35 | 2026-09-15 | Frontend | **Teléfono con código de país (U19)**: nuevo `PhoneField` (select nativo de código + input tel) en `/join/:slug`. Códigos del piloto `+51` (Perú) y `+56` (Chile) — **default derivado del slug** (D23: el último segmento es el país), fallback `+51` (mercado base). El payload concatena `código + número local` en `phone_number` (contrato D21 intacto, suelto y ≤20); el schema usa `phone_code` (enum) + `phone_local` (≤15) como split solo de UI | U19; un restaurante PE y uno CL necesitan prefijos distintos y el QR/slug ya codifica el país — no pedir el país aparte; lista mínima de los 2 países del piloto (nada especulativo) | prefijo fijo `+51` (rompe para CL), campo de texto libre del código (error-prone), catálogo completo de países (gold-plating fuera del piloto), separar país en otro campo del form (el slug ya lo trae) |
| D36 | 2026-09-15 | Frontend | **Código de país como prefijo fijo, sin select (U20)**: `PhoneField` pasa a un `InputGroup` (patrón shadcn adaptado al `@theme`, sin cva/cn) con el código (`+51`/`+56`) como addon no interactivo a la izquierda de un único input tel. El form ya no tiene `phone_code`: el schema es `phone` (≤15) y el submit antepone `countryCodeForSlug(slug)`; el usuario no elige país porque el QR de un local PE/CL ya lo define — un comensal extranjero entra con el prefijo del local (supuesto de piloto) | U20; el select de D35 añade una decisión que el slug ya resolvió; un solo input con prefijo visible reduce fricción y pasos (también elimina el `z.enum` y sus checks) | mantener el select (U19/D35), input libre con máscara automática del prefijo (gold-plating), seleccionar país desde un menú desplegable (misma objeción que el select) |
| D37 | 2026-09-15 | Frontend | **Rediseño dark del flujo comensal (U21, /impeccable)**: tema base **dark** para todo el producto (no un modo — decisión del usuario 2026-09-15), dirección **canon de la categoría** (estándar del rubro jugado recto, sin ironía): neutros cálidos oscuros (surface `oklch(0.22 0.012 60)`, hue 60–80 — nunca azul-gris), **un solo acento ámbar** (`brand`) gastado solo en la acción primaria y el momento NOTIFIED, sistema sans (sin webfont, PRD §4.3), tarjeta comensal/turno como **un solo objeto físico tipo boarding pass** (número de turno gigante 5.5rem, línea de corte punteada, footer "Fila virtual — Mesa247"), motion `ticket-warm` 0.7 s expo con `prefers-reduced-motion`; barra de oficio fijada por el usuario: **Toast POS, pase de abordaje de aerolínea, app de Starbucks, OpenTable/Resy** (commit de marca en PRODUCT.md). T7 se re-estiliza con tokens existentes sin tocar contrato; T8 se implementó en su parte central (vista viva del turno con polling 5 s, estados WAITING/NOTIFIED y terminales con copy real) — "Ya no voy" (cancelar) queda pendiente en el roadmap. Design tokens + reglas documentados en `apps/web/DESIGN.md` + sidecar `.impeccable/design.json` | U21; PRD §3 (noche, luces del local, comensal en la puerta con datos móviles) pide foco cálido legible; D30 (roles semánticos OKLCH) se reusa — mismo nombre de tokens, valores oscuros; D14/D19 (sin migraciones, capas) intactos; el finish reviewer de /impeccable devolvió `ship` | modo oscuro opt-in del SO (el usuario pidió tema base, no modos), dirección "Order Up" lanzada por el dado (cocina/expedite — quedó como alterna completa), mundo letterpress/imprenta y mesa de corte de film (competitivas — descartadas por el usuario), azul SaaS genérico (D30 ya lo rechazó), colores hardcodeados (viola D30), mantener el placeholder de T8 (el turno real es el corazón del producto) |
| D38 | 2026-09-15 | Frontend/Backend | **T8 completada + persistencia local del turno (U22)**: nuevo endpoint comensal `POST /tickets/{id}/no-show` (reusa la matriz de transiciones D24 y mapea el "Ya no voy" del comensal a **NO_SHOW**, no CANCELLED — el reporte D25 los distingue); el ticket se guarda en **localStorage** (`mesa247.tickets.v1`) al unirse y aparece en la nueva vista **"Tus turnos"** (cards vivas con polling 5 s) en `/`; expira a las **8 h desde el join** (TTL sobre la fecha local de guardado, aproximación del `created_at` del servidor que el contrato no expone), se **limpia al llegar a un estado terminal** (SEATED/CANCELLED/NO_SHOW) desde la vista del turno o desde las cards; salir confirma con **AlertDialog de Base UI** (D32); reabrir un id guardado nunca extiende el TTL | El comensal con datos móviles (PRD §4.3) puede cerrar la pestaña y volver a su turno sin re-escaneo; conocer el id del ticket equivale a poseerlo (UUID no adivinable, mismo modelo de confianza que `GET /tickets/{id}` en el piloto); el "ya no voy" como NO_SHOW mantiene el lenguaje del dominio (D24) y el conteo del reporte (D25) | cleanup solo al recargar la pestaña activa (pierde el estado al cerrar — exactamente lo que U22 pidió resolver), cookie/IndexedDB (ceremonia para una clave), TTL 24 h (un turno de noche no debe sobrevivir al día siguiente), guardar un snapshot de posición en el storage (mentiría: el backend es la verdad, las cards consultan en vivo), "Ya no voy" como CANCELLED al estilo host (rompe la semántica D24), botón de salir sin confirmación (fricción mínima que evita bajas accidentales del reporte) |
| D39 | 2026-09-15 | Backend | **T14 — Auth PIN implementado (D33)**: `pin_code_hash` (NOT NULL, `VARCHAR(120)` — ver desviación abajo) en `Restaurant` con **PBKDF2-HMAC-SHA256** (salt aleatoria 16 B por PIN, 100 000 iteraciones, formato `pbkdf2_sha256$iter$sal_hex$digest_hex`, verificación con `hmac.compare_digest` — tiempo constante); `POST /host/{slug}/login` valida el PIN → **JWT HS256** de sesión corta (payload `sub`=id + `slug` del local, `iat`/`exp`; secret `jwt_secret` y expiración `jwt_expire_minutes=60` en `core/config.py`, defaults dev), responses: 401 "PIN incorrecto", 404 local no encontrado, 422 PIN no numérico (schema 4–6 dígitos); seed carga PINs demo **1111/2222/3333** por local — el PIN en claro vive SOLO en `seed.py` (script de aprovisionamiento), a la BD va solo el hash; dep **PyJWT 2.14.0** añadida. **Desviación**: la nota técnica declaraba `pin_hash VARCHAR(100)` pero el formato hex del hash ocupa **118 chars** → columna de 120 (actualizado también en la nota). Rutas `/host/*` siguen abiertas: `require_host` es T15 | D33 ya decidió PIN hasheado + JWT corto; sin gestión de usuarios (3 locales, tablets compartidas); PBKDF2 con sal por PIN evita forzar todos los hashes en una pasada si la BD se filtra (los 4 dígitos de PIN se fuerzan trivial en claro — el hash no es la defensa contra fuerza bruta, los 100k iteraciones + sal sí la encarecen); PyJWT es el estándar FastAPI; `compare_digest` evita timing attack | bcrypt/argon2 (más deps nativas para el piloto; PBKDF2 de stdlib es suficiente con sal 16 B), python-jose (menos mantenido que PyJWT), JWT con `exp` como única reclamación (sin `slug`: T15 no podría scope-arlo al local), devolver el PIN o su hash en el login (nunca — el token solo lleva sub/slug), columna `VARCHAR(100)` de la nota (no alcanza — ver desviación) |

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