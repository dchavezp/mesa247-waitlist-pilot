import { Button } from '../../components/Button'
import { clearHostSession } from './hostSession'

interface HostSignedInProps {
  slug: string
}

export function HostSignedIn({ slug }: HostSignedInProps) {
  return (
    <section className="rounded-2xl border border-line bg-surface-raised shadow-card">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Sesión iniciada
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Panel de {slug}. La cola en vivo llega en la próxima iteración.
        </p>
      </header>

      <div className="mx-6 mt-5 border-t border-dashed border-line" aria-hidden="true" />

      <div className="px-6 py-5">
        <Button variant="secondary" onClick={clearHostSession} className="w-full">
          Cerrar sesión
        </Button>
      </div>
    </section>
  )
}