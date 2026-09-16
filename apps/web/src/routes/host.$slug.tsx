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
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      {/* La cola con acciones necesita un poco más de ancho; el login queda en max-w-sm. */}
      <div className={session ? 'w-full max-w-md' : 'w-full max-w-sm'}>
        {session ? <HostQueueView slug={slug} /> : <HostLoginForm slug={slug} />}
      </div>
    </main>
  )
}