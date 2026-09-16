import { useQuery } from '@tanstack/react-query'
import { getDayReport } from '../api/host'

interface DayReportOptions {
  /** The report modal refetches on open only (D48); the board may poll lightly for its average-wait stat. */
  refetchInterval?: number
}

export function useDayReport(slug?: string, options?: DayReportOptions) {
  return useQuery({
    queryKey: ['host-report', slug],
    queryFn: () => getDayReport(slug!),
    enabled: !!slug,
    staleTime: 30_000,
    refetchInterval: options?.refetchInterval,
  })
}