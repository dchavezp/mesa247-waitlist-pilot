import { z } from 'zod'

export const hostLoginSchema = z.object({
  pin: z.string().trim().regex(/^\d{4,6}$/, { error: 'El PIN son 4 a 6 dígitos' }),
})

export type HostLoginForm = z.infer<typeof hostLoginSchema>