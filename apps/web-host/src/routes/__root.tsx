import { createRootRoute, Outlet } from '@tanstack/react-router'
import { NotFoundPage } from '@mesa247/shared'

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: HostNotFound,
})

function HostNotFound() {
  return (
    <NotFoundPage description="No existe una sala con esa dirección. Verificá el enlace del restaurante o escaneá el QR de nuevo." />
  )
}