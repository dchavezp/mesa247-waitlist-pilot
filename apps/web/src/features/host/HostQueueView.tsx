import { useMemo, useState } from 'react'
import { ChartColumn, LogOut, QrCode } from 'lucide-react'
import { ApiError } from '../../api/client'
import type { HostQueueItem, QueueStatus } from '../../api/types'
import { Button } from '../../components/Button'
import { useDayReport } from '../../hooks/useDayReport'
import { useHostQueue } from '../../hooks/useHostQueue'
import { clearHostSession } from './hostSession'
import { DayReportModal } from './DayReportModal'
import { DoorQrModal } from './DoorQrModal'
import { QueueCard, type QueueCardPending } from './QueueCard'
import { useReorderQueue } from './useReorderQueue'
import { useRestaurantInfo } from './useRestaurantInfo'
import { useTransitionTicket } from './useTransitionTicket'

interface HostQueueViewProps {
  slug: string
}

type QueueFilter = 'all' | QueueStatus

const FILTERS: { value: QueueFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'WAITING', label: 'Esperando' },
  { value: 'NOTIFIED', label: 'Llamados' },
  { value: 'SEATED', label: 'Sentados' },
  { value: 'CANCELLED', label: 'Cancelados' },
  { value: 'NO_SHOW', label: 'No vinieron' },
]

const ACTIVE_STATUSES: QueueStatus[] = ['WAITING', 'NOTIFIED']

export function HostQueueView({ slug }: HostQueueViewProps) {
  const queue = useHostQueue(slug)
  const report = useDayReport(slug, { refetchInterval: 30_000 })
  const restaurant = useRestaurantInfo(slug)
  const transition = useTransitionTicket(slug)
  const reorder = useReorderQueue(slug)
  const [filter, setFilter] = useState<QueueFilter>('all')
  const [qrOpen, setQrOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const detail = (error: unknown): string =>
    error instanceof ApiError ? error.detail : 'Inténtalo de nuevo.'

  const cardState = (
    item: HostQueueItem,
  ): { pending: QueueCardPending | null; error: string | null } => {
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

  // Reorder must stay a permutation of the live ids only (D3); terminal cards
  // are history and are not part of the queue order.
  const prioritize = (item: HostQueueItem) => {
    const order = (queue.data ?? [])
      .filter((entry) => ACTIVE_STATUSES.includes(entry.status))
      .map((entry) => entry.id)
    const index = order.indexOf(item.id)
    if (index <= 0) return
    ;[order[index - 1], order[index]] = [order[index], order[index - 1]]
    reorder.mutate({ id: item.id, order })
  }

  const hasData = !queue.isPending && !queue.isError && queue.data !== undefined
  const items = useMemo(() => queue.data ?? [], [queue.data])
  const activeCount = useMemo(
    () => items.filter((item) => ACTIVE_STATUSES.includes(item.status)).length,
    [items],
  )
  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.status === filter)),
    [items, filter],
  )
  const avgWait = report.data?.avg_wait_minutes ?? null

  return (
    <div className="w-full">
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Panel del anfitrión
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {restaurant.data?.name ?? 'Cola del local'}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {restaurant.data?.description ?? 'Cargando…'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setQrOpen(true)}>
            <QrCode className="size-4" aria-hidden="true" />
            QR de la puerta
          </Button>
          <Button variant="secondary" onClick={() => setReportOpen(true)}>
            <ChartColumn className="size-4" aria-hidden="true" />
            Reporte del día
          </Button>
          <Button variant="secondary" onClick={clearHostSession}>
            <LogOut className="size-4" aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">
          {FILTERS.map(({ value, label }) => {
            const selected = filter === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={selected}
                className={[
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                  selected
                    ? 'bg-ink text-surface'
                    : 'border border-line text-ink-muted hover:text-ink',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        <dl className="flex items-center gap-6 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-ink-muted">En cola</dt>
            <dd className="text-lg font-semibold tabular-nums text-ink">{activeCount}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-ink-muted">Espera media</dt>
            <dd className="text-lg font-semibold tabular-nums text-ink">
              {avgWait !== null && avgWait > 0 ? `~${avgWait} min` : '—'}
            </dd>
          </div>
        </dl>
      </div>

      {queue.isPending ? <QueueGridSkeleton /> : null}

      {queue.isError ? (
        <div role="alert" className="mt-6 rounded-xl border border-line bg-surface-raised p-6">
          <h2 className="text-lg font-semibold text-ink">No pudimos cargar la cola</h2>
          <p className="mt-1 text-sm text-ink-muted">{detail(queue.error)}</p>
          <Button className="mt-4" onClick={() => queue.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {hasData && filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">
          {filter === 'all'
            ? 'No hay nadie en la cola. Cuando alguien escanee el QR de la puerta, aparece acá.'
            : 'No hay turnos con este estado.'}
        </p>
      ) : null}

      <div className="max-h-[70vh] overflow-y-auto">
        {hasData && filtered.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-3">
          {filtered.map((item) => {
            const { pending, error } = cardState(item)
            return (
              <QueueCard
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
      </div>

      <DoorQrModal slug={slug} open={qrOpen} onOpenChange={setQrOpen} />
      <DayReportModal slug={slug} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  )
}

function QueueGridSkeleton() {
  return (
    <div aria-label="Cargando la cola" className="mt-6">
      <p className="sr-only">Cargando la cola…</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-32 animate-pulse rounded-xl border border-line bg-surface-raised"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}