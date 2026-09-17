import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { QrCode } from 'lucide-react'
import { SavedTicketCard } from '../features/ticket/SavedTicketCard'
import {
  loadSavedTickets,
  removeSavedTicket,
  type SavedTicket,
} from '../features/ticket/ticketStorage'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const [saved, setSaved] = useState<SavedTicket[]>(() => loadSavedTickets())

  const handleTerminal = useCallback((id: string) => {
    // El turno terminó (sentado, cancelado o no-show): sale de "Tus turnos".
    removeSavedTicket(id)
    setSaved((prev) => prev.filter((ticket) => ticket.id !== id))
  }, [])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        {saved.length === 0 ? (
          <section className="text-center">
            <QrCode
              className="mx-auto size-10 text-ink-muted"
              aria-hidden="true"
            />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              Mesa247
            </h1>
            <p className="mt-3 text-sm text-ink-muted">
              Escanea el código QR en la puerta para unirte a la fila virtual.
            </p>
          </section>
        ) : (
          <>
            <header className="px-1">
<h1 className="text-2xl font-semibold tracking-tight text-ink">
                  Tus turnos
                </h1>
              <p className="mt-1.5 text-sm text-ink-muted">
                Se guardan 8 h en este navegador. Toca un turno para verlo en
                vivo.
              </p>
            </header>
            <ul className="mt-6 space-y-1">
              {saved.map((ticket) => (
                <li key={ticket.id}>
                  <SavedTicketCard id={ticket.id} onTerminal={handleTerminal} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}