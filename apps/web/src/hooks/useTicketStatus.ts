import { useQuery } from '@tanstack/react-query'
import { getTicketStatus } from '../api/guest'

// PRD §5.1: the guest view polls every 5 s (D2 short polling, no websockets/SSE).
export function useTicketStatus(id?: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketStatus(id!),
    enabled: !!id,
    refetchInterval: 5_000,
  })
}