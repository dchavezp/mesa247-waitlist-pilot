import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { ApiError, NotFoundPage } from '@mesa247/shared'
import { JoinForm } from '../features/join/JoinForm'
import { useRestaurantInfo } from '../features/join/useRestaurantInfo'
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
  const restaurantQuery = useRestaurantInfo(slug)

  const handleTerminal = useCallback((id: string) => {
    // El turno terminó (sentado, cancelado o no-show): sale de "Tus turnos".
    removeSavedTicket(id)
    setSaved((prev) => prev.filter((ticket) => ticket.id !== id))
  }, [])

  if (restaurantQuery.isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-surface px-4">
        <p className="text-sm text-ink-muted">Cargando el local…</p>
      </main>
    )
  }

  if (restaurantQuery.isError) {
    // 404 ("Local no encontrado") = el slug no existe: empty state. Cualquier
    // otro error (servidor caído, sin red) merece un mensaje propio, no decirle
    // al comensal que el local no existe.
    const notFound =
      restaurantQuery.error instanceof ApiError &&
      restaurantQuery.error.status === 404
    return (
      <NotFoundPage
        description={
          notFound
            ? 'El local que buscás no existe o el enlace es incorrecto. Escaneá el QR de la puerta.'
            : 'No pudimos cargar el local. Revisá tu conexión e intentá de nuevo.'
        }
        action={
          <Link
            to="/"
            className="text-sm font-medium text-brand hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Volver al inicio
          </Link>
        }
      />
    )
  }

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

        <JoinForm slug={slug} restaurantName={restaurantQuery.data.name} />
      </div>
    </main>
  )
}