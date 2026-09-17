import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

// InputGroup: contenedor con borde y focus-within; el addon (prefijo) y el
// input comparten un solo borde, patrón tomado de shadcn InputGroup y
// adaptado a los tokens del tema (D30). Las clases se combinan con el util
// cn compartido (twMerge resuelve conflictos con className del consumidor).

type InputGroupProps = ComponentProps<'div'> & {
  /** Borde rojo cuando el campo tiene error (aria-invalid en el control). */
  invalid?: boolean
}

export function InputGroup({ invalid, className, ...divProps }: InputGroupProps) {
  return (
    <div
      {...divProps}
      className={cn(
        'flex w-full items-center rounded-lg border bg-surface transition-colors focus-within:outline-none',
        invalid ? 'border-danger focus-within:border-danger' : 'border-line focus-within:border-brand',
        className,
      )}
    />
  )
}

type InputGroupAddonProps = ComponentProps<'span'>

// Prefijo visible (p. ej. "+51"); mantiene la separación visual con el input.
export function InputGroupAddon({ className, ...spanProps }: InputGroupAddonProps) {
  return (
    <span
      {...spanProps}
      className={cn('select-none border-r border-line px-3 text-sm text-ink-muted', className)}
    />
  )
}

type InputGroupInputProps = ComponentProps<'input'>

// Input sin borde propio: el grupo es el que dibuja el borde y el foco.
export function InputGroupInput({ className, ...inputProps }: InputGroupInputProps) {
  return (
    <input
      {...inputProps}
      className={cn(
        'min-w-0 flex-1 bg-transparent px-3 py-2 text-ink placeholder:text-ink-muted focus:outline-none',
        className,
      )}
    />
  )
}