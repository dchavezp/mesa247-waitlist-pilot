import { createFileRoute } from '@tanstack/react-router'
import { HostLoginForm } from '../features/host/HostLoginForm'
import { HostSignedIn } from '../features/host/HostSignedIn'
import { useHostSession } from '../features/host/useHostSession'

export const Route = createFileRoute('/host/$slug')({
  component: HostRoute,
})

function HostRoute() {
  const { slug } = Route.useParams()
  const session = useHostSession(slug)
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        {session ? <HostSignedIn slug={slug} /> : <HostLoginForm slug={slug} />}
      </div>
    </main>
  )
}