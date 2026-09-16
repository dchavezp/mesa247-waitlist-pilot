import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useEffect, useState } from 'react'
import { Button } from '@mesa247/shared'
import { useLeaveTicket } from './useLeaveTicket'

export function LeaveTicketButton({ id }: { id: string }) {
  const leave = useLeaveTicket(id)
  const [open, setOpen] = useState(false)

  // Cierra la confirmación cuando el "Ya no voy" llegó al servidor; la vista
  // muestra el estado terminal vía cache de react-query (useLeaveTicket).
  useEffect(() => {
    if (leave.isSuccess) setOpen(false)
  }, [leave.isSuccess])

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger
        render={<Button variant="secondary" className="w-full" />}
      >
        Ya no voy
      </AlertDialog.Trigger>

      {leave.isError ? (
        <p role="alert" className="mt-3 text-center text-sm text-danger">
          No se pudo actualizar tu turno. Inténtalo de nuevo.
        </p>
      ) : null}

      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-10 bg-black/60" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface-raised p-6 shadow-card">
          <AlertDialog.Title className="text-xl font-semibold tracking-tight text-ink">
            ¿Ya no vas a esperar?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-1.5 text-sm text-ink-muted">
            Perderás tu lugar en la fila. Si fue un error, acércate a la
            recepción para volver a unirte.
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col gap-3">
            <AlertDialog.Close
              render={<Button className="w-full" disabled={leave.isPending} />}
              onClick={() => leave.mutate()}
              disabled={leave.isPending}
            >
              {leave.isPending ? 'Saliendo…' : 'Sí, salir de la fila'}
            </AlertDialog.Close>
            <AlertDialog.Close
              render={
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={leave.isPending}
                />
              }
              disabled={leave.isPending}
            >
              Seguir esperando
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}