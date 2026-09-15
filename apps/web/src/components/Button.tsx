import type { ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong',
  secondary: 'bg-surface-raised text-ink border border-line hover:border-brand-strong',
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
  const classes = [
    'rounded-lg px-4 py-2 font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:opacity-60',
    variantClasses[variant],
    className,
  ].join(' ')

  return <button type={type} className={classes} {...props} />
}