import type { ComponentProps } from 'react'
import { useId } from 'react'

export type FieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export function Field({ label, error, id, className, ...inputProps }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}