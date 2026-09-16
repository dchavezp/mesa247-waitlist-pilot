import { useQuery } from '@tanstack/react-query'
import { getDayReport } from '../api/host'

export function useDayReport(slug?: string) {
  return useQuery({
    queryKey: ['host-report', slug],
    queryFn: () => getDayReport(slug!),
    enabled: !!slug,
    staleTime: 30_000,
  })
}