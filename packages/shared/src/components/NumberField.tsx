import type { ComponentProps } from 'react'
import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import type { ButtonVariant } from './Button'
import { cn } from '../lib/cn'

interface NumberFieldProps extends ComponentProps<typeof NumberFieldPrimitive.Root> {
  label: string
  error?: string
  buttonVariant?: ButtonVariant
  className?: string
}

const stepperClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong',
  secondary: 'bg-surface-raised text-ink hover:text-brand-strong',
  danger: 'text-danger hover:bg-danger-soft',
}

export function NumberField({
  label,
  error,
  buttonVariant = 'secondary',
  className,
  id,
  ...rootProps
}: NumberFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const stepperBase = cn(
    'inline-flex items-center justify-center px-2 disabled:opacity-60',
    stepperClasses[buttonVariant],
  )

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <NumberFieldPrimitive.Root {...rootProps} id={inputId}>
        <NumberFieldPrimitive.Group
          className={cn(
            'flex items-stretch rounded-lg border bg-surface transition-colors',
            'focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-surface',
            error ? 'border-danger' : 'border-line focus-within:border-brand',
          )}
        >
          <NumberFieldPrimitive.Decrement
            className={cn(stepperBase, 'rounded-l-lg border-r border-line')}
            aria-label="Disminuir"
          >
            <Minus className="size-4" aria-hidden="true" />
          </NumberFieldPrimitive.Decrement>
          <NumberFieldPrimitive.Input
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-center text-ink focus:outline-none"
          />
          <NumberFieldPrimitive.Increment
            className={cn(stepperBase, 'rounded-r-lg border-l border-line')}
            aria-label="Aumentar"
          >
            <Plus className="size-4" aria-hidden="true" />
          </NumberFieldPrimitive.Increment>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}