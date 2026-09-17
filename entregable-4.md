# Entregable 4 — Algo que construí yo

> El brief pide diez líneas sobre algo que construí —idealmente solo— y que
> llegó a producción: **qué corté, qué salió mal y qué haría distinto.**
> Esto es ese entregable, con el código al centro: el renderizado de la tarjeta
> del turno comensal con **records en vez de validaciones**, y las mejoras
> visuales de las cards de la lista del anfitrión.

## Qué construí

Dos piezas del flujo de espera que comparten la misma idea: en lugar de
repetir `if (status === 'X')` por cada estado en medio del render, toda la UI
que depende del estado sale de un **record de búsqueda** (`Record<QueueStatus, …>`).
Agregar un estado nuevo = agregar una clave; el tamaño del componente ya no
crece por estado.

## 1. Renderizado con records en vez de validaciones

### Antes — condicionales en el render

Cada estado era un bloque `{status === 'X' ? (…) : null}` dentro del JSX.
Cinco bloques que repetían estructura y obligaban a leer el componente entero
para saber qué podía pintarse:

```tsx
{status === 'NOTIFIED' ? (
  <>
    <h1 className="mt-6 text-2xl font-semibold text-brand">¡Tu mesa está lista!</h1>
    <p className="mt-1.5 text-sm text-ink-muted">Acércate a la recepción y te ubicamos en tu mesa.</p>
  </>
) : null}

{status === 'SEATED' ? (
  <>
    <h1 className="mt-6 text-2xl font-semibold text-success">¡Buen provecho!</h1>
    <p className="mt-1.5 text-sm text-ink-muted">Tu mesa está lista. Gracias por esperar.</p>
  </>
) : null}
```

### Después — todo el texto e iconos por estado en dos records

```tsx
const statusIcons: Record<QueueStatus, ReactNode> = {
  WAITING: null,
  NOTIFIED: null,
  SEATED: <CircleCheck className="size-14 text-success" />,
  CANCELLED: <CircleX className="size-14 text-danger" />,
  NO_SHOW: <UserX className="size-14 text-warning" />,
}

const statusCopies: Record<QueueStatus, ReactNode> = {
  WAITING: null,
  NOTIFIED: (
    <>
      <h1 className="mt-6 text-2xl font-semibold text-brand">¡Tu mesa está lista!</h1>
      <p className="mt-1.5 text-sm text-ink-muted">Acércate a la recepción y te ubicamos en tu mesa.</p>
    </>
  ),
  SEATED: (
    <>
      <h1 className="mt-6 text-2xl font-semibold text-success">¡Buen provecho!</h1>
      <p className="mt-1.5 text-sm text-ink-muted">Tu mesa está lista. Gracias por esperar.</p>
    </>
  ),
  CANCELLED: (
    <>
      <h1 className="mt-6 text-xl font-semibold text-ink">Tu turno fue cancelado</h1>
      <p className="mt-1.5 text-sm text-ink-muted">Si fue un error, habla con la recepción para volver a unirte.</p>
    </>
  ),
  NO_SHOW: (
    <>
      <h1 className="mt-6 text-xl font-semibold text-ink">No pudimos encontrarte</h1>
      <p className="mt-1.5 text-sm text-ink-muted">Se llamó tu mesa y no hubo respuesta. Si sigues en el local, acércate a la recepción.</p>
    </>
  ),
}
```

El render se reduce a leer la entrada correspondiente: `icon = statusIcons[status]`,
`copy = statusCopies[status]`, y `null` significa "no hay nada que pintar" (los
estados ACTIVos muestran el número grande; los terminales, el icono + copy):

```tsx
{icon}
{copy}

{hero ? (
  <>
    <p className="text-[5.5rem] font-semibold leading-none tracking-tight text-ink">{position}</p>
    <h1 className="mt-6 text-lg font-medium text-ink">Esperas en la posición {position}</h1>
    {/* …estimado… */}
  </>
) : null}
```

**Qué mejora en la lectura:** el componente ya no es una lista de casos
especiales; es la definición visual de "cómo se ve cada estado", y eso se puede
leer, comparar y editar de una sola pasada. Un estado nuevo deja de ser "copiar
otro bloque y cambiar el texto" y pasa a ser "agregar una clave al record".

## 2. Mejoras visuales de las cards de la lista del anfitrión

El mismo patrón de records, aplicado al chip de estado de cada card:

```tsx
const STATUS_CHIP: Record<QueueStatus, { label: string; classes: string }> = {
  WAITING: {
    label: 'Esperando',
    classes: 'border border-line text-ink-muted animate-pulse',
  },
  NOTIFIED: {
    label: 'Llamado',
    classes: 'bg-brand-soft text-brand animate-pulse h-fit w-fit',
  },
  SEATED: {
    label: 'Sentado',
    classes: 'bg-success-soft text-success',
  },
  CANCELLED: {
    label: 'Cancelado',
    classes: 'bg-danger-soft text-danger',
  },
  NO_SHOW: {
    label: 'No vino',
    classes: 'bg-warning-soft text-warning',
  },
}
```

La card usa ese record para pintar el chip y decide qué se muestra según si el
turno está activo (`WAITING | NOTIFIED`) o terminal:

```tsx
const chip = STATUS_CHIP[item.status]

<article className={[
  'flex flex-row gap-3 justify-between rounded-xl border items-center border-line p-4',
  active ? 'bg-surface-raised' : 'bg-surface',
  active ? '' : 'text-ink-muted',
].join(' ')}>
  {/* nombre + personas · chip · turno / "hace X min" */}
  <div className={['rounded-full px-2.5 py-1 text-xs font-medium', chip.classes].join(' ')}>
    {chip.label}
  </div>

  {active ? (
    <>Turno <strong>{item.position}</strong> · {calledMin !== null ? `hace ${calledMin} min` : estimate}</>
  ) : (
    'Fuera de la cola'
  )}
  {/* acciones por estado: Priorizar / Llamar / Sentar / Cancelar */}
</article>
```

**Cambios de aspecto que se notan en la tabla:**

- Las filas pasaron a **cards** con borde y esquinas redondeadas, en grid
  responsive.
- **Chip de estado por turno** (`Esperando` / `Llamado` / `Sentado` /
  `Cancelado` / `No vino`), con semáforo de color vía tokens del tema
  (`brand`/`success`/`danger`/`warning`, no literales).
- Los turnos **terminales ya no desaparecen de la pantalla** cuando se sienta o
  cancela: quedan con su chip y receden visualmente (`Fuera de la cola`).
- Los activos usan `surface-raised`, muestran la posición, "hace X min" desde
  el llamado (con semáforo: <7 min neutro, ≥7 naranja, >10 rojo) y las acciones
  contextuales (Priorizar / Llamar / Sentar / Cancelar).

## Qué corté

- **El "boarding pass" viejo del comensal**: divider punteado + footer
  "Fila virtual · Mesa247". El número gigante quedó solo en los estados activos;
  los terminales muestran icono + copy, sin número.
- **Ocultar los turnos terminales de la tabla del anfitrión**: pensé que al
  sentar a alguien la card debía desaparecer. Lo corté: en una mesa de trabajo
  querés ver *qué pasó hace un momento*, así que el chip de estado terminal
  cuenta esa historia en su lugar.
- No agregué librerías de animación ni micro-interacciones: el pulso de los
  chips (`animate-pulse`) sale de los tokens de Tailwind v4 que ya estaban.

## Qué salió mal

- **La card desaparecía al sentar/cancelar** (D42→D51): el endpoint de la cola
  excluía los tickets terminales, así que el primer intento de "mostrar el
  estado en la card" no tenía con qué pintar. Terminó siendo un cambio de
  contrato: el endpoint devuelve los tickets del día y las cards renderizan
  terminales. Backend + frontend + tests moviéndose juntos por un cambio visual.
- **"hace X min" eterno** (U33): `notified_at` se serializaba como timestamp
  UTC naive (sin offset) y `dayjs` lo leía como hora local del navegador; el
  diff salía negativo y la UI mostraba "hace <1 min" para siempre. La corrección
  fue parsear explícitamente como UTC (`dayjs.utc`) del lado del cliente.

## Qué haría distinto

- El record resuelve muy bien el contenido *estático* por estado, pero
  `WAITING` sigue con un branch inline porque renderiza datos vivos (posición y
  estimado). Lo llevaría a **un componente por estado** (`StatusHero`) para que
  TODOS los estados fluyan por el mismo mecanismo, no dos.
- Las classes de Tailwind v4 viven como strings dentro del record. Las
  mantendría junto al label (co-locación), pero derivadas de tokens del tema
  para no repetir literales de color entre cards y chips.
- No volvería a mezclar un cambio de contrato (endpoint) con un cambio visual:
  primero decido "qué ve el anfitrión cuando un turno termina", después el chip.
  Cambiar la API por estética fue lo más caro de esta pieza.

## Dónde vive el código

- `apps/web-guest/src/features/ticket/TicketCard.tsx` — records `statusIcons` y `statusCopies`
- `apps/web-host/src/features/host/QueueCard.tsx` — record `STATUS_CHIP` y la card