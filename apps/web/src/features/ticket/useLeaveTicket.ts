import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveQueue } from '../../api/guest'

/** "Ya no voy" del comensal: NO_SHOW en vivo, sin esperar el próximo poll. */
export function useLeaveTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => leaveQueue(id),
    onSuccess: (status) => {
      queryClient.setQueryData(['ticket', id], status)
    },
  })
}