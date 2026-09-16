import { useQuery } from '@tanstack/react-query'
import { getRestaurantInfo } from '../../api/host'

/** Restaurant name/description for the board header. Static data, never stale. */
export function useRestaurantInfo(slug?: string) {
  return useQuery({
    queryKey: ['host-restaurant', slug],
    queryFn: () => getRestaurantInfo(slug!),
    enabled: !!slug,
    staleTime: Infinity,
  })
}