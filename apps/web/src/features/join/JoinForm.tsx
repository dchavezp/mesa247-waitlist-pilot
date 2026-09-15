import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { ApiError } from '../../api/client'
import { joinQueue } from '../../api/guest'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { PhoneField, countryCodeForSlug } from '../../components/PhoneField'
import { joinSchema, type JoinForm } from './joinSchema'

interface JoinFormProps {
  slug: string
}

export function JoinForm({ slug }: JoinFormProps) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const defaultCountryCode = countryCodeForSlug(slug)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema) as Resolver<JoinForm>,
    defaultValues: {
      customer_name: '',
      phone: '',
      party_size: 1,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const ticket = await joinQueue(slug, {
        customer_name: values.customer_name,
        phone_number: `${defaultCountryCode}${values.phone}`,
        party_size: values.party_size,
      })
      navigate({ to: '/tickets/$id', params: { id: ticket.id } })
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.detail
          ? error.detail
          : 'No se pudo unir a la fila. Inténtalo de nuevo.',
      )
    }
  })

  return (
    <section className="rounded-2xl border border-line bg-surface-raised shadow-card">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Únete a la fila
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Completa tus datos para ingresar a la fila virtual.
        </p>
      </header>

      <div className="mx-6 mt-5 border-t border-dashed border-line" aria-hidden="true" />

      <form onSubmit={onSubmit} className="space-y-5 px-6 py-5" noValidate>
        <Field
          label="Nombre"
          placeholder="Tu nombre"
          autoComplete="name"
          error={errors.customer_name?.message}
          {...register('customer_name')}
        />
        <PhoneField
          label="Teléfono"
          countryCode={defaultCountryCode}
          error={errors.phone?.message}
          inputProps={{ ...register('phone'), placeholder: 'Tu teléfono' }}
        />
        <Field
          label="Comensales"
          type="number"
          inputMode="numeric"
          min={1}
          error={errors.party_size?.message}
          {...register('party_size')}
        />

        {formError ? (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Uniéndote…' : 'Unirse'}
        </Button>
      </form>
    </section>
  )
}