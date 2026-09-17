import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong',
  secondary: 'bg-surface-raised text-ink border border-line hover:border-brand-strong',
  danger: 'text-danger border border-danger hover:bg-danger-soft',
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}