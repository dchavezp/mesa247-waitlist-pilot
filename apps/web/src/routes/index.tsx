import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Mesa247
        </h1>
        <p className="mt-3 text-neutral-500">
          Escanea el código QR para ingresar a la fila virtual.
        </p>
      </div>
    </main>
  )
}