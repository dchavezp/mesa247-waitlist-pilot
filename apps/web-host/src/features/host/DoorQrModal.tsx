import { Dialog } from '@base-ui/react/dialog'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@mesa247/shared'

interface DoorQrModalProps {
  slug: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoorQrModal({ slug, open, onOpenChange }: DoorQrModalProps) {
  const joinUrl = `${window.location.origin}/join/${slug}`

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-10 bg-surface/70" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface-raised p-6 shadow-card">
          <Dialog.Title className="text-xl font-semibold tracking-tight text-ink">
            QR de la puerta
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm text-ink-muted">
            Escaneá para entrar a la fila. El código lleva directo a la página
            de unión de {slug}.
          </Dialog.Description>

          <div className="mt-5 flex justify-center">
            {/* El QR necesita fondo claro para escanearse — excepción al tema oscuro. */}
            <div className="rounded-xl bg-white p-4">
              <QRCodeSVG value={joinUrl} size={168} level="M" marginSize={2} />
            </div>
          </div>

          <p className="mt-4 break-all text-center text-xs text-ink-muted">
            {joinUrl}
          </p>

          <Dialog.Close render={<Button className="mt-6 w-full" />}>
            Cerrar
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}