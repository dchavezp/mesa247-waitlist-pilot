import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { ApiError } from '../../api/client'
import { hostLogin } from '../../api/host'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { saveHostSession } from './hostSession'
import { hostLoginSchema, type HostLoginForm } from './hostSchema'

interface HostLoginFormProps {
  slug: string
}

export function HostLoginForm({ slug }: HostLoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
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
      // Al guardar la sesión, useHostSession notifica y la ruta pasa al
      // estado "Sesión iniciada" sin navegación adicional.
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
        <Field
          label="PIN"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          placeholder="••••"
          error={errors.pin?.message}
          {...register('pin')}
        />

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