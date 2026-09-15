import { request } from './client'
import type {
  DayReport,
  HostAction,
  HostLoginRequest,
  HostLoginResponse,
  HostQueueItem,
  TicketStatus,
} from './types'

export function getHostQueue(slug: string): Promise<HostQueueItem[]> {
  return request<HostQueueItem[]>(`/host/${slug}/queue`)
}

export function transitionTicket(id: string, action: HostAction): Promise<TicketStatus> {
  return request<TicketStatus>(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  })
}

export function reorderQueue(slug: string, order: string[]): Promise<HostQueueItem[]> {
  return request<HostQueueItem[]>(`/host/${slug}/queue/reorder`, {
    method: 'POST',
    body: JSON.stringify({ order }),
  })
}

export function getDayReport(slug: string): Promise<DayReport> {
  return request<DayReport>(`/host/${slug}/report`)
}

export function hostLogin(slug: string, pin: string): Promise<HostLoginResponse> {
  return request<HostLoginResponse>(`/host/${slug}/login`, {
    method: 'POST',
    body: JSON.stringify({ pin } satisfies HostLoginRequest),
  })
}