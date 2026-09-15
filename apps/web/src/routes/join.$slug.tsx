import { createFileRoute } from '@tanstack/react-router'
import { JoinForm } from '../features/join/JoinForm'

export const Route = createFileRoute('/join/$slug')({
  component: JoinRoute,
})

function JoinRoute() {
  const { slug } = Route.useParams()
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <JoinForm slug={slug} />
      </div>
    </main>
  )
}