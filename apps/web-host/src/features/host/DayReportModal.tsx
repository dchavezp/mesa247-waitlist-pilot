import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@mesa247/shared'
import { useDayReport } from '../../hooks/useDayReport'

interface DayReportModalProps {
  slug: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DayReportModal({ slug, open, onOpenChange }: DayReportModalProps) {
  const report = useDayReport(slug)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-10 bg-surface/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface-raised p-6 shadow-card">
          <Dialog.Title className="text-xl font-semibold tracking-tight text-ink">
            Reporte del día
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm text-ink-muted">
            Resumen de actividad del día para {slug}.
          </Dialog.Description>

          {report.isPending ? (
            <div className="mt-5 space-y-3" aria-label="Cargando reporte">
              {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="h-10 w-full animate-pulse rounded-lg bg-surface" aria-hidden="true" />
              ))}
            </div>
          ) : report.isError ? (
            <div className="mt-5">
              <p className="text-sm text-danger">No pudimos cargar el reporte.</p>
              <Button className="mt-3 w-full" onClick={() => report.refetch()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <dl className="mt-5 space-y-3">
              <StatRow label="Se unieron" value={report.data.joined} />
              <StatRow label="Se sentaron" value={report.data.seated} />
              <StatRow label="Se fueron sin sentarse" value={report.data.left_without_seat} />
              <StatRow label="No vinieron" value={report.data.no_show} />
              <StatRow
                label="Espera promedio"
                value={report.data.avg_wait_minutes > 0 ? `~${report.data.avg_wait_minutes} min` : '—'}
              />
            </dl>
          )}

          <Dialog.Close render={<Button className="mt-6 w-full" />}>
            Cerrar
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="text-lg font-semibold tabular-nums text-ink">{value}</span>
    </div>
  )
}