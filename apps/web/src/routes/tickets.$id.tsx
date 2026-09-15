import { createFileRoute } from '@tanstack/react-router'
import { useTicketStatus } from '../features/ticket/useTicketStatus'
import { TicketCard, LoadingTicket, TicketError } from '../features/ticket/TicketCard'

export const Route = createFileRoute('/tickets/$id')({
  component: TicketRoute,
})

function TicketRoute() {
  const { id } = Route.useParams()
  const { data, isLoading, isError, refetch } = useTicketStatus(id)

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
          />
        ) : null}
      </div>
    </main>
  )
}