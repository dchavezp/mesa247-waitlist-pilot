import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (data && TERMINAL_STATUSES.has(data.status)) onTerminal(id)
  }, [data, id, onTerminal])

  const card = 'flex items-stretch gap-4 rounded-2xl border bg-surface-raised p-4 shadow-card transition-colors'

  return (
    <Link
      to="/tickets/$id"
      params={{ id }}
      className={`${card} ${
        data?.status === 'NOTIFIED' ? 'border-brand' : 'border-line'
      }`}
    >
      {isLoading ? (
        <>
          <div className="mx-auto h-12 w-16 animate-pulse rounded-lg bg-surface" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-40 animate-pulse rounded-full bg-surface" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-surface" />
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
          <div className="flex min-w-12 items-center justify-center">
            <span
              className={
                data.status === 'WAITING' || data.status === 'NOTIFIED'
                  ? 'text-3xl font-semibold leading-none tracking-tight text-ink'
                  : 'text-xl font-semibold leading-none tracking-tight text-ink-muted'
              }
            >
              {data.position}
            </span>
          </div>
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
              <p className="text-sm font-semibold text-brand">
                ¡Tu mesa está lista!
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