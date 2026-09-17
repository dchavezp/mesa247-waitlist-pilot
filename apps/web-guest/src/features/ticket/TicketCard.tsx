import type { ReactNode } from 'react'
import type { QueueStatus } from '@mesa247/shared'
import { Button } from '@mesa247/shared'
import { CircleCheck, CircleX, UserX } from 'lucide-react'

const statusIcons: Record<QueueStatus, ReactNode> = {
  WAITING: null,
  NOTIFIED: null,
  SEATED: <CircleCheck className="size-14 text-success" />,
  CANCELLED: <CircleX className="size-14 text-danger" />,
  NO_SHOW: <UserX className="size-14 text-warning" />,
}

const statusCopies: Record<QueueStatus, ReactNode> = {
  WAITING: null,
  NOTIFIED: 
          <>
            <h1 className="mt-6 text-2xl font-semibold text-brand">
              ¡Tu mesa está lista!
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Acércate a la recepción y te ubicamos en tu mesa.
            </p>
          </>,
  SEATED: 
          <>
            <h1 className="mt-6 text-2xl font-semibold text-success">
              ¡Buen provecho!
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Tu mesa está lista. Gracias por esperar.
            </p>
          </>,
  CANCELLED: 
          <>
            <h1 className="mt-6 text-xl font-semibold text-ink">
              Tu turno fue cancelado
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Si fue un error, habla con la recepción para volver a unirte.
            </p>
          </>,
  NO_SHOW: 
          <>
            <h1 className="mt-6 text-xl font-semibold text-ink">
              No pudimos encontrarte
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Se llamó tu mesa y no hubo respuesta. Si sigues en el local,
              acércate a la recepción.
            </p>
          </>,
}

export function TicketCard({
  status,
  position,
  estimated,
  actions,
}: {
  status: QueueStatus
  position: number
  estimated: number
  /** Acciones del comensal (ej. "Ya no voy") mientras el turno está activo. */
  actions?: ReactNode
}) {
  const hero = status === 'WAITING' || status === 'NOTIFIED'

  return (
    <section aria-label="Tu turno" className="text-center">
      <div
        role="status"
        className={`px-6 pb-2 pt-8 ${
          status === 'NOTIFIED' ? 'animate-ticket-warm' : ''
        }`}
      >
        {hero ? (
          <p className="text-[5.5rem] font-semibold leading-none tracking-tight text-ink">
            {position}
          </p>
        ) : (
          <div aria-hidden="true" className="flex justify-center">
            {statusIcons[status]}
          </div>
        )}

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

        {statusCopies[status]}

        {actions && (status === 'WAITING' || status === 'NOTIFIED') ? (
          <div className="mt-6">{actions}</div>
        ) : null}
      </div>
    </section>
  )
}

export function LoadingTicket() {
  return (
    <section aria-label="Cargando tu turno">
      <div className="mx-auto h-24 w-32 animate-pulse rounded-2xl bg-surface" aria-hidden="true" />
      <div className="mx-auto mt-6 h-4 w-52 animate-pulse rounded-full bg-surface" aria-hidden="true" />
      <div className="mx-auto mt-3 h-3 w-36 animate-pulse rounded-full bg-surface" aria-hidden="true" />
    </section>
  )
}

export function TicketError({ onRetry }: { onRetry: () => void }) {
  return (
    <section role="alert">
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