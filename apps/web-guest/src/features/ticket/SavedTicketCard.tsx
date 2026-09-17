import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCallNotification } from './useCallNotification'
import { useTicketStatus } from './useTicketStatus'

const TERMINAL_STATUSES = new Set(['SEATED', 'CANCELLED', 'NO_SHOW'])

export function SavedTicketCard({
  id,
  onTerminal,
}: {
  id: string
  /** El turno llegó a un estado terminal: el dueño del estado lo limpia. */
  onTerminal: (id: string) => void
}) {
  const { data, isLoading, isError } = useTicketStatus(id)

  useCallNotification(id, data?.status)

  useEffect(() => {
    if (data && TERMINAL_STATUSES.has(data.status)) onTerminal(id)
  }, [data, id, onTerminal])

  return (
    <Link
      to="/tickets/$id"
      params={{ id }}
      className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-surface-raised border border-ink"
    >
      {data?.status === 'NOTIFIED' && !isError ? (
        <span
          aria-hidden="true"
          className="-ml-2 h-12 w-2 shrink-0 rounded-full bg-brand animate-pulse"
        />
      ) : null}

      {isLoading ? (
        <>
          <div className="h-12 w-16 shrink-0 animate-pulse rounded-lg bg-surface-raised" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-40 animate-pulse rounded-full bg-surface-raised" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-surface-raised" />
          </div>
        </>
      ) : null}

      {isError ? (
        <div className="py-1">
          <p className="text-sm font-medium text-ink">Turno no disponible</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Toca para reintentar. Se sigue actualizando solo.
          </p>
        </div>
      ) : null}

      {data && !isError ? (
        <>
          {data.status === 'WAITING' || data.status === 'NOTIFIED' ? (
            <div className="flex min-w-12 items-center justify-center">
              <span className="text-3xl font-semibold leading-none tracking-tight text-ink">
                {data.position}
              </span>
            </div>
          ) : null}
          <div className="min-w-0 flex-1 self-center">
            {data.status === 'WAITING' ? (
              <>
                <p className="truncate text-sm font-medium text-ink">
                  Esperas en la posición {data.position}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {data.estimated_minutes > 0
                    ? `~${data.estimated_minutes} min restantes`
                    : 'En breve'}
                </p>
              </>
            ) : null}
            {data.status === 'NOTIFIED' ? (
              <p className="text-sm font-semibold text-brand animate-pulse">
                ¡Tu mesa está lista! <span className='text-ink text-xs'> | Acércate a la recepción</span>
              </p>
            ) : null}
            {data.status === 'SEATED' ? (
              <p className="text-sm font-medium text-success">¡Buen provecho!</p>
            ) : null}
            {data.status === 'CANCELLED' ? (
              <p className="text-sm font-medium text-ink">Tu turno fue cancelado</p>
            ) : null}
            {data.status === 'NO_SHOW' ? (
              <p className="text-sm font-medium text-ink">
                Saliste de la fila
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </Link>
  )
}