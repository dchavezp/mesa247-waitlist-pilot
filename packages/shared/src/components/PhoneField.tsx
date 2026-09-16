import type { ComponentProps } from 'react'
import { useId } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup'

export type PhoneCountryCode = '+51' | '+56'

// Pilot slugs end with the country segment (D23); Peru is the home-market
// default and unknown slugs 404 server-side anyway.
export function countryCodeForSlug(slug: string): PhoneCountryCode {
  return slug.endsWith('-cl') ? '+56' : '+51'
}

interface PhoneFieldProps {
  label: string
  error?: string
  /** Prefijo fijo derivado del slug del local (D35): no es editable. */
  countryCode: PhoneCountryCode
  inputProps: ComponentProps<'input'>
  className?: string
}

export function PhoneField({ label, error, countryCode, inputProps, className }: PhoneFieldProps) {
  const generatedId = useId()
  const inputId = `${generatedId}-phone`

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <InputGroup invalid={!!error}>
        <InputGroupAddon>{countryCode}</InputGroupAddon>
        <InputGroupInput
          {...inputProps}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </InputGroup>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}