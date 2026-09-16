import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { ApiError } from '../../api/client'
import { hostLogin } from '../../api/host'
import { Button } from '../../components/Button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../../components/InputOTP'
import { saveHostSession } from './hostSession'
import { hostLoginSchema, type HostLoginForm } from './hostSchema'

interface HostLoginFormProps {
  slug: string
}

export function HostLoginForm({ slug }: HostLoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const otpId = useId()
  const pinErrorId = useId()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HostLoginForm>({
    resolver: zodResolver(hostLoginSchema) as Resolver<HostLoginForm>,
    defaultValues: { pin: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const session = await hostLogin(slug, values.pin)
      saveHostSession(slug, session.access_token, session.expires_in)
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.detail
          ? error.detail
          : 'No se pudo entrar. Inténtalo de nuevo.',
      )
    }
  })

  return (
    <section className="rounded-2xl border border-line bg-surface-raised shadow-card">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Panel del anfitrión
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Ingresa el PIN del local para gestionar la cola.
        </p>
      </header>

      <div className="mx-6 mt-5 border-t border-dashed border-line" aria-hidden="true" />

      <form onSubmit={onSubmit} className="space-y-5 px-6 py-5" noValidate>
        <div>
          <label htmlFor={otpId} className="mb-1 block text-sm font-medium text-ink">
            PIN de 6 caracteres
          </label>
          <Controller
            name="pin"
            control={control}
            render={({ field, fieldState }) => (
              <InputOTP
                id={otpId}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={fieldState.error ? pinErrorId : undefined}
                {...field}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.pin?.message ? (
            <p id={pinErrorId} className="mt-1 text-sm text-danger">
              {errors.pin.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Ingresando…' : 'Entrar'}
        </Button>
      </form>
    </section>
  )
}