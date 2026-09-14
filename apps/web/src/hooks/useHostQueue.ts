import { useQuery } from '@tanstack/react-query'
import { getHostQueue } from '../api/host'

export function useHostQueue(slug?: string) {
  return useQuery({
    queryKey: ['host-queue', slug],
    queryFn: () => getHostQueue(slug!),
    enabled: !!slug,
    refetchInterval: 5_000,
  })
}