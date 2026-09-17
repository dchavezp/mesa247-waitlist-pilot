import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function BackToHome() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Tus turnos
    </Link>
  )
}