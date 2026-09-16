import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderQueue } from "../../api/host";

interface ReorderVariables {
  id: string;
  order: string[];
}

export function useReorderQueue(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: ReorderVariables) =>
      reorderQueue(slug, variables.order),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["host-queue", slug] });
    },
  });
}
