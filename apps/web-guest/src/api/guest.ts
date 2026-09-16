import { createApiClient } from '@mesa247/shared'
import type { JoinRequest, JoinResponse, TicketStatus } from '@mesa247/shared'

// Vite env lives here, not in packages/shared (which is plain TS, no Vite).
// Undefined falls through to the shared dev default.
const request = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })

export function joinQueue(slug: string, body: JoinRequest): Promise<JoinResponse> {
  return request<JoinResponse>(`/join/${slug}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getTicketStatus(id: string): Promise<TicketStatus> {
  return request<TicketStatus>(`/tickets/${id}`)
}

export function leaveQueue(id: string): Promise<TicketStatus> {
  return request<TicketStatus>(`/tickets/${id}/no-show`, { method: 'POST' })
}