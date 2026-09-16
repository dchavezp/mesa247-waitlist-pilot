import type { HostQueueItem } from '../../api/types'
import { Button } from '../../components/Button'

export type QueueRowPending = 'notify' | 'seat' | 'cancel' | 'prioritize'

interface QueueRowProps {
  item: HostQueueItem
  pending: QueueRowPending | null
  error: string | null
  onNotify: () => void
  onSeat: () => void
  onCancel: () => void
  onPrioritize: () => void
}

export function QueueRow({
  item,
  pending,
  error,
  onNotify,
  onSeat,
  onCancel,
  onPrioritize,
}: QueueRowProps) {
  const waiting = item.status === 'WAITING'
  const busy = pending !== null
  const people = item.party_size === 1 ? '1 persona' : `${item.party_size} personas`
  const estimate = item.estimated_minutes > 0
    ? `~${item.estimated_minutes} min`
    : 'En breve'

  return (
    <li>
      <div className="px-6 py-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-xl font-semibold tabular-nums leading-none text-ink">
            {item.position}
          </span>
          <h3 className="min-w-0 truncate text-sm font-medium text-ink">
            {item.customer_name}
          </h3>
        </div>
        <p className="mt-1.5 text-xs text-ink-muted">
          {people} · {estimate} ·{' '}
          {waiting ? (
            'Esperando'
          ) : (
            <span className="font-medium text-brand">Llamado</span>
          )}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {waiting ? (
            <>
              <Button
                variant="secondary"
                disabled={busy || item.position === 1}
                onClick={onPrioritize}
              >
                {pending === 'prioritize' ? 'Priorizando…' : 'Priorizar'}
              </Button>
              <Button variant="danger" disabled={busy} onClick={onCancel}>
                {pending === 'cancel' ? 'Cancelando…' : 'Cancelar'}
              </Button>
              <Button disabled={busy} onClick={onNotify}>
                {pending === 'notify' ? 'Llamando…' : 'Llamar'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="danger" disabled={busy} onClick={onCancel}>
                {pending === 'cancel' ? 'Cancelando…' : 'Cancelar'}
              </Button>
              <Button disabled={busy} onClick={onSeat}>
                {pending === 'seat' ? 'Sentando…' : 'Sentar'}
              </Button>
            </>
          )}
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </li>
  )
}