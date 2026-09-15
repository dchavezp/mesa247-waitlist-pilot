import { z } from "zod";

export const joinSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(1, { error: "Ingresa tu nombre" })
    .max(100, { error: "Máximo 100 caracteres" }),
  phone: z
    .string()
    .trim()
    .min(1, { error: "Ingresa tu teléfono" })
    .max(15, { error: "Máximo 15 caracteres" }),
  party_size: z.coerce
    .number()
    .int({ error: "Ingresa un número entero" })
    .min(1, { error: "Al menos 1 comensal" }),
});

export type JoinForm = z.infer<typeof joinSchema>;
