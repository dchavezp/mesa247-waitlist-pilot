import { createFileRoute } from '@tanstack/react-router'
import { HostLoginForm } from '../features/host/HostLoginForm'
import { HostQueueView } from '../features/host/HostQueueView'
import { useHostSession } from '../features/host/useHostSession'

export const Route = createFileRoute('/host/$slug')({
  component: HostRoute,
})

function HostRoute() {
  const { slug } = Route.useParams()
  const session = useHostSession(slug)
  return (
    <main className="min-h-dvh bg-surface px-6 py-6">
      {/* Board a todo el ancho con 24px de padding (U29); el login queda centrado en max-w-sm. */}
      {session ? (
        <HostQueueView slug={slug} />
      ) : (
        <div className="flex min-h-[calc(100dvh-3rem)] items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <HostLoginForm slug={slug} />
          </div>
        </div>
      )}
    </main>
  )
}