import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { NotFoundPage } from '@mesa247/shared'

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: GuestNotFound,
})

function GuestNotFound() {
  return (
    <NotFoundPage
      description="La dirección que buscás no existe o el enlace ya venció. Escaneá el QR de nuevo."
      action={
        <Link
          to="/"
          className="text-sm font-medium text-brand hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Volver al inicio
        </Link>
      }
    />
  )
}