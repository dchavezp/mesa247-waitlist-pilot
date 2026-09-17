import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import {
  ApiError,
  Button,
  Field,
  NumberField,
  PhoneField,
  countryCodeForSlug,
} from "@mesa247/shared";
import { joinQueue } from "../../api/guest";
import { saveSavedTicket } from "../ticket/ticketStorage";
import { requestNotificationPermission } from "../ticket/useCallNotification";
import { joinSchema, type JoinForm } from "./joinSchema";

interface JoinFormProps {
  slug: string;
  restaurantName: string;
}

export function JoinForm({ slug, restaurantName }: JoinFormProps) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const defaultCountryCode = countryCodeForSlug(slug);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema) as Resolver<JoinForm>,
    defaultValues: {
      customer_name: "",
      phone: "",
      party_size: 1,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const ticket = await joinQueue(slug, {
        customer_name: values.customer_name,
        phone_number: `${defaultCountryCode}${values.phone}`,
        party_size: values.party_size,
      });
      saveSavedTicket(ticket.id);
      requestNotificationPermission();
      navigate({ to: "/tickets/$id", params: { id: ticket.id } });
    } catch (error) {
      setFormError(
        error instanceof ApiError && error.detail
          ? error.detail
          : "No se pudo unir a la fila. Inténtalo de nuevo.",
      );
    }
  });

  return (
    <div className="w-full">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {restaurantName}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        Únete a la fila
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Completa tus datos para ingresar a la fila virtual.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <Field
          label="Nombre"
          placeholder="Tu nombre"
          autoComplete="name"
          error={errors.customer_name?.message}
          {...register("customer_name")}
        />
        <PhoneField
          label="Teléfono"
          countryCode={defaultCountryCode}
          error={errors.phone?.message}
          inputProps={{ ...register("phone"), placeholder: "Tu teléfono" }}
        />
        <Controller
          name="party_size"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              label="Comensales"
              error={fieldState.error?.message}
              value={field.value}
              min={1}
              step={1}
              onValueChange={(value) => field.onChange(value)}
            />
          )}
        />
        {formError ? (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Uniéndote…" : "Unirse"}
        </Button>
      </form>
    </div>
  );
}
