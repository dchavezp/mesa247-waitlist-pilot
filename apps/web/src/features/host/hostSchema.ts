import { z } from 'zod'

export const hostLoginSchema = z.object({
  pin: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]{6}$/, { error: 'El PIN son 6 caracteres (letras y números)' }),
})

export type HostLoginForm = z.infer<typeof hostLoginSchema>