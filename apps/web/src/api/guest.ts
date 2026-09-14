import { request } from './client'
import type { JoinRequest, JoinResponse, TicketStatus } from './types'

export function joinQueue(slug: string, body: JoinRequest): Promise<JoinResponse> {
  return request<JoinResponse>(`/join/${slug}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getTicketStatus(id: string): Promise<TicketStatus> {
  return request<TicketStatus>(`/tickets/${id}`)
}