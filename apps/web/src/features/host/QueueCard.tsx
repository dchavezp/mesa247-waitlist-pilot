import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Armchair, ArrowUp, PhoneCall, Users, X } from 'lucide-react'

// The API emits UTC timestamps (naive or with explicit offset); parse as UTC so a
// "hace X min" never drifts by the browser's timezone (U33).
dayjs.extend(utc)

import type { HostQueueItem, QueueStatus } from '../../api/types'
import { Button } from '../../components/Button'
import { useNow } from '../../hooks/useNow'

export type QueueCardPending = 'notify' | 'seat' | 'cancel' | 'prioritize'

export interface QueueCardProps {
  item: HostQueueItem
  pending: QueueCardPending | null
  error: string | null
  onNotify: () => void
  onSeat: () => void
  onCancel: () => void
  onPrioritize: () => void
}

const STATUS_CHIP: Record<QueueStatus, { label: string; classes: string }> = {
  WAITING: {
    label: 'Esperando',
    classes: 'border border-line text-ink-muted animate-pulse',
  },
  NOTIFIED: {
    label: 'Llamado',
    classes: 'bg-brand-soft text-brand animate-pulse h-fit w-fit',
  },
  SEATED: {
    label: 'Sentado',
    classes: 'bg-success-soft text-success',
  },
  CANCELLED: {
    label: 'Cancelado',
    classes: 'bg-danger-soft text-danger',
  },
  NO_SHOW: {
    label: 'No vino',
    classes: 'bg-warning-soft text-warning',
  },
}

const ACTIVE_STATUSES: QueueStatus[] = ['WAITING', 'NOTIFIED']

/** Elapsed minutes since the call, or null when the ticket is not NOTIFIED (U32). */
function minutesSinceCalled(item: HostQueueItem, now: number): number | null {
  if (item.status !== 'NOTIFIED' || !item.notified_at) return null
  return dayjs(now).diff(dayjs.utc(item.notified_at), 'minute')
}

export function QueueCard({
  item,
  pending,
  error,
  onNotify,
  onSeat,
  onCancel,
  onPrioritize,
}: QueueCardProps) {
  const now = useNow()
  const active = ACTIVE_STATUSES.includes(item.status)
  const busy = pending !== null
  const people = item.party_size === 1 ? '1 persona' : `${item.party_size} personas`
  const estimate = item.estimated_minutes > 0 ? `~${item.estimated_minutes} min` : 'En breve'
  const chip = STATUS_CHIP[item.status]
  const calledMin = minutesSinceCalled(item, now)

  return (
    <li>
      <article
        className={[
          'flex h-full flex-row gap-3 justify-between rounded-xl border items-center border-line p-4',
          active ? 'bg-surface-raised' : 'bg-surface',
          active ? '' : 'text-ink-muted',
        ].join(' ')}
      >
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-start justify-between gap-3 w-60">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink">{item.customer_name}</h3>
              <div className="flex flex-row items-center gap-1 mt-0.5 text-xs text-ink-muted">
                <Users className='size-3'/>
                <p>{people}</p>
              </div>
            </div>
            <div className="self-center w-24 flex flex-row items-center justify-center ">
              <div
                className={[
                  'rounded-full px-2.5 py-1 text-xs font-medium w-fit h-fit text-center',
                  chip.classes,
                ].join(' ')}
              >
                {chip.label}
              </div>
            </div>
          </div>
          <div className="text-xs text-ink-muted">
            {active ? (
              <>
                Turno <span className="font-semibold tabular-nums text-ink">{item.position}</span>
                {' · '}
                {calledMin !== null ? (
                  <span
                    className={
                      calledMin > 10
                        ? 'font-semibold text-danger'
                        : calledMin >= 7
                          ? 'font-semibold text-warning'
                          : 'text-ink-muted'
                    }
                    title={item.notified_at ?? undefined}
                  >
                    {calledMin < 1 ? 'hace <1 min' : `hace ${calledMin} min`}
                  </span>
                ) : (
                  estimate
                )}
              </>
            ) : (
              'Fuera de la cola'
            )}
          </div>
        </div>

        {active ? (
          <div className="mt-auto flex flex-wrap gap-2">
            {item.status === 'WAITING' ? (
              <>
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={busy || item.position === 1}
                  onClick={onPrioritize}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                  {pending === 'prioritize' ? 'Priorizando…' : 'Priorizar'}
                </Button>
                <Button variant="danger" disabled={busy} onClick={onCancel}>
                  <X className="size-4" aria-hidden="true" />
                  {pending === 'cancel' ? 'Cancelando…' : 'Cancelar'}
                </Button>
                <Button className="flex-1" disabled={busy} onClick={onNotify}>
                  <PhoneCall className="size-4" aria-hidden="true" />
                  {pending === 'notify' ? 'Llamando…' : 'Llamar'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="danger" disabled={busy} onClick={onCancel}>
                  <X className="size-4" aria-hidden="true" />
                  {pending === 'cancel' ? 'Cancelando…' : 'Cancelar'}
                </Button>
                <Button className="flex-1" disabled={busy} onClick={onSeat}>
                  <Armchair className="size-4" aria-hidden="true" />
                  {pending === 'seat' ? 'Sentando…' : 'Sentar'}
                </Button>
              </>
            )}
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </article>
    </li>
  )
}