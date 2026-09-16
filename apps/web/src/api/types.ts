export type QueueStatus = 'WAITING' | 'NOTIFIED' | 'SEATED' | 'CANCELLED' | 'NO_SHOW'

export type HostAction = 'notify' | 'seat' | 'cancel' | 'no_show'

export interface JoinRequest {
  customer_name: string
  phone_number: string
  party_size: number
}

export interface JoinResponse {
  id: string
  position: number
}

export interface TicketStatus {
  id: string
  status: QueueStatus
  position: number
  estimated_minutes: number
}

export interface HostQueueItem {
  id: string
  customer_name: string
  party_size: number
  status: QueueStatus
  position: number
  estimated_minutes: number
  notified_at: string | null
}

export interface RestaurantInfo {
  slug: string
  name: string
  description: string | null
}

export interface ReorderRequest {
  order: string[]
}

export interface DayReport {
  joined: number
  seated: number
  left_without_seat: number
  no_show: number
  avg_wait_minutes: number
}

export interface HostLoginRequest {
  pin: string
}

export interface HostLoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}