import { useQuery } from '@tanstack/react-query'
import { getRestaurantInfo } from '../../api/guest'

/** Nombre/descripción del local en la vista de unirse (U37).
 *  La info no cambia en la vida del turno: sin stale, sin refetch. */
export function useRestaurantInfo(slug: string) {
  return useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => getRestaurantInfo(slug),
    staleTime: Infinity,
  })
}