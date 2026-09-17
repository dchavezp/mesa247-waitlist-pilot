import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { JoinForm } from '../features/join/JoinForm'
import { BackToHome } from '../features/nav/BackToHome'
import { SavedTicketCard } from '../features/ticket/SavedTicketCard'
import {
  loadSavedTickets,
  removeSavedTicket,
  type SavedTicket,
} from '../features/ticket/ticketStorage'

export const Route = createFileRoute('/join/$slug')({
  component: JoinRoute,
})

function JoinRoute() {
  const { slug } = Route.useParams()
  const [saved, setSaved] = useState<SavedTicket[]>(() => loadSavedTickets())

  const handleTerminal = useCallback((id: string) => {
    // El turno terminó (sentado, cancelado o no-show): sale de "Tus turnos".
    removeSavedTicket(id)
    setSaved((prev) => prev.filter((ticket) => ticket.id !== id))
  }, [])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <BackToHome />
        </div>

        {saved.length > 0 ? (
          <section className="mb-8">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Tus turnos
            </h2>
            <ul className="mt-3 space-y-1">
              {saved.map((ticket) => (
                <li key={ticket.id}>
                  <SavedTicketCard id={ticket.id} onTerminal={handleTerminal} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <JoinForm slug={slug} />
      </div>
    </main>
  )
}