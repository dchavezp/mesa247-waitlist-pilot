import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LeaveTicketButton } from '../features/ticket/LeaveTicketButton'
import { TicketCard, LoadingTicket, TicketError } from '../features/ticket/TicketCard'
import { removeSavedTicket } from '../features/ticket/ticketStorage'
import { useTicketStatus } from '../features/ticket/useTicketStatus'

const TERMINAL_STATUSES = new Set(['SEATED', 'CANCELLED', 'NO_SHOW'])

export const Route = createFileRoute('/tickets/$id')({
  component: TicketRoute,
})

function TicketRoute() {
  const { id } = Route.useParams()
  const { data, isLoading, isError, refetch } = useTicketStatus(id)

  // El turno terminó (sentado, cancelado o no-show): deja de pertenecer a
  // "Tus turnos". La vista terminal se mantiene en esta página.
  useEffect(() => {
    if (data && TERMINAL_STATUSES.has(data.status)) removeSavedTicket(id)
  }, [data, id])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        {isLoading ? <LoadingTicket /> : null}
        {isError ? <TicketError onRetry={() => void refetch()} /> : null}
        {data && !isError ? (
          <TicketCard
            status={data.status}
            position={data.position}
            estimated={data.estimated_minutes}
            actions={<LeaveTicketButton id={id} />}
          />
        ) : null}
      </div>
    </main>
  )
}