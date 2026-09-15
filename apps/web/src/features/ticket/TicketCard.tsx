import type { QueueStatus } from '../../api/types'
import { Button } from '../../components/Button'

export function TicketCard({
  status,
  position,
  estimated,
}: {
  status: QueueStatus
  position: number
  estimated: number
}) {

  const hero = status === 'WAITING' || status === 'NOTIFIED'

  return (
    <section
      aria-label="Tu turno"
      className={`rounded-2xl border bg-surface-raised shadow-card ${
        status === 'NOTIFIED' ? 'animate-ticket-warm border-brand' : 'border-line'
      }`}
    >
      <div role="status" className="px-6 pb-2 pt-8 text-center">
        <p
          className={
            hero
              ? 'text-[5.5rem] font-semibold leading-none tracking-tight text-ink'
              : 'text-4xl font-semibold leading-none tracking-tight text-ink-muted'
          }
        >
          {position}
        </p>

        {status === 'WAITING' ? (
          <>
            <h1 className="mt-6 text-lg font-medium text-ink">
              Esperas en la posición {position}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {estimated > 0
                ? estimated === 1
                  ? '~1 min restante'
                  : `~${estimated} min restantes`
                : 'En breve'}
            </p>
          </>
        ) : null}

        {status === 'NOTIFIED' ? (
          <>
            <h1 className="mt-6 text-2xl font-semibold text-brand">
              ¡Tu mesa está lista!
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Acércate a la recepción y te ubicamos en tu mesa.
            </p>
          </>
        ) : null}

        {status === 'SEATED' ? (
          <>
            <h1 className="mt-6 text-2xl font-semibold text-success">
              ¡Buen provecho!
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Tu mesa está lista. Gracias por esperar.
            </p>
          </>
        ) : null}

        {status === 'CANCELLED' ? (
          <>
            <h1 className="mt-6 text-xl font-semibold text-ink">
              Tu turno fue cancelado
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Si fue un error, habla con la recepción para volver a unirte.
            </p>
          </>
        ) : null}

        {status === 'NO_SHOW' ? (
          <>
            <h1 className="mt-6 text-xl font-semibold text-ink">
              No pudimos encontrarte
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Se llamó tu mesa y no hubo respuesta. Si sigues en el local,
              acércate a la recepción.
            </p>
          </>
        ) : null}
      </div>

      <div className="mx-6 my-6 border-t border-dashed border-line" aria-hidden="true" />

      <footer className="flex items-center justify-between px-6 pb-6 text-xs text-ink-muted">
        <span>Fila virtual</span>
        <span>Mesa247</span>
      </footer>
    </section>
  )
}

export function LoadingTicket() {
  return (
    <section
      aria-label="Cargando tu turno"
      className="rounded-2xl border border-line bg-surface-raised px-6 pb-6 pt-8 shadow-card"
    >
      <p className="sr-only">Cargando tu turno…</p>
      <div className="mx-auto h-24 w-32 animate-pulse rounded-xl bg-surface" aria-hidden="true" />
      <div className="mx-auto mt-6 h-4 w-52 animate-pulse rounded-full bg-surface" aria-hidden="true" />
      <div className="mx-auto mt-3 h-3 w-36 animate-pulse rounded-full bg-surface" aria-hidden="true" />
      <div className="mt-6 border-t border-dashed border-line" aria-hidden="true" />
      <div className="mt-6 h-3 w-24 animate-pulse rounded-full bg-surface" aria-hidden="true" />
    </section>
  )
}

export function TicketError({ onRetry }: { onRetry: () => void }) {
  return (
    <section role="alert" className="rounded-2xl border border-line bg-surface-raised p-6 shadow-card">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        No pudimos cargar tu turno
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Revisa tu conexión e inténtalo de nuevo.
      </p>
      <Button type="button" onClick={onRetry} className="mt-5 w-full">
        Reintentar
      </Button>
    </section>
  )
}