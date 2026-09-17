import type { ReactNode } from 'react'

interface NotFoundPageProps {
  title?: string
  description: string
  action?: ReactNode
}

export function NotFoundPage({
  title = 'Página no encontrada',
  description,
  action,
}: NotFoundPageProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4 py-10 text-center">
      <p className="text-6xl font-medium text-brand" aria-hidden="true">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </main>
  )
}