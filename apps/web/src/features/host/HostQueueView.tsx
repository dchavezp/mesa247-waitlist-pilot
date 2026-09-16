import { useState } from 'react'
import { ApiError } from '../../api/client'
import type { HostQueueItem } from '../../api/types'
import { Button } from '../../components/Button'
import { useHostQueue } from '../../hooks/useHostQueue'
import { clearHostSession } from './hostSession'
import { DoorQrModal } from './DoorQrModal'
import { QueueRow, type QueueRowPending } from './QueueRow'
import { useReorderQueue } from './useReorderQueue'
import { useTransitionTicket } from './useTransitionTicket'

interface HostQueueViewProps {
  slug: string
}

export function HostQueueView({ slug }: HostQueueViewProps) {
  const queue = useHostQueue(slug)
  const transition = useTransitionTicket(slug)
  const reorder = useReorderQueue(slug)
  const [qrOpen, setQrOpen] = useState(false)

  const detail = (error: unknown): string =>
    error instanceof ApiError ? error.detail : 'Inténtalo de nuevo.'

  const rowState = (
    item: HostQueueItem,
  ): { pending: QueueRowPending | null; error: string | null } => {
    if (transition.isPending && transition.variables?.id === item.id) {
      return { pending: transition.variables.action, error: null }
    }
    if (reorder.isPending && reorder.variables?.id === item.id) {
      return { pending: 'prioritize', error: null }
    }
    const error =
      transition.isError && transition.variables?.id === item.id
        ? detail(transition.error)
        : reorder.isError && reorder.variables?.id === item.id
          ? detail(reorder.error)
          : null
    return { pending: null, error }
  }

  const prioritize = (item: HostQueueItem) => {
    const order = (queue.data ?? []).map((entry) => entry.id)
    const index = order.indexOf(item.id)
    if (index <= 0) return
    ;[order[index - 1], order[index]] = [order[index], order[index - 1]]
    reorder.mutate({ id: item.id, order })
  }

  const hasData = !queue.isPending && !queue.isError && queue.data !== undefined

  return (
    <section className="rounded-2xl border border-line bg-surface-raised shadow-card">
      <header className="px-6 pt-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Cola del local
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Panel de {slug}</p>
        <div className="mt-4 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setQrOpen(true)}
          >
            QR de la puerta
          </Button>
          <Button variant="secondary" className="flex-1" onClick={clearHostSession}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="mx-6 mt-5 border-t border-dashed border-line" aria-hidden="true" />

      {queue.isPending ? <QueueSkeleton /> : null}

      {queue.isError ? (
        <div role="alert" className="px-6 py-5">
          <h2 className="text-lg font-semibold text-ink">
            No pudimos cargar la cola
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{detail(queue.error)}</p>
          <Button className="mt-4 w-full" onClick={() => queue.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {hasData && queue.data.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-ink-muted">
          No hay nadie en la cola. Cuando alguien escanee el QR de la puerta,
          aparece acá.
        </p>
      ) : null}

      {hasData && queue.data.length > 0 ? (
        <ul className="divide-y divide-line">
          {queue.data.map((item) => {
            const { pending, error } = rowState(item)
            return (
              <QueueRow
                key={item.id}
                item={item}
                pending={pending}
                error={error}
                onNotify={() => transition.mutate({ id: item.id, action: 'notify' })}
                onSeat={() => transition.mutate({ id: item.id, action: 'seat' })}
                onCancel={() => transition.mutate({ id: item.id, action: 'cancel' })}
                onPrioritize={() => prioritize(item)}
              />
            )
          })}
        </ul>
      ) : null}

      <div className="mx-6 mt-5 border-t border-dashed border-line" aria-hidden="true" />

      <footer className="flex items-center justify-between px-6 pb-6 pt-5 text-xs text-ink-muted">
        <span>Cola en vivo</span>
        <span>Mesa247</span>
      </footer>

      <DoorQrModal slug={slug} open={qrOpen} onOpenChange={setQrOpen} />
    </section>
  )
}

function QueueSkeleton() {
  return (
    <div aria-label="Cargando la cola" className="px-6 py-5">
      <p className="sr-only">Cargando la cola…</p>
      {[0, 1, 2].map((row) => (
        <div key={row} className="py-3">
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-surface" aria-hidden="true" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-surface" aria-hidden="true" />
          <div className="mt-3 h-8 w-full animate-pulse rounded-lg bg-surface" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}