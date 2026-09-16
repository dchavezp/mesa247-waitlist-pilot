import { useQuery } from "@tanstack/react-query";
import { getTicketStatus } from "../../api/guest";

export function useTicketStatus(id?: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketStatus(id!),
    enabled: !!id,
    refetchInterval: 5_000,
  });
}
