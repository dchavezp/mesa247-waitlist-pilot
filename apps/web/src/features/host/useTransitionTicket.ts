import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transitionTicket } from "../../api/host";
import type { HostAction } from "../../api/types";

interface TransitionVariables {
  id: string;
  action: Exclude<HostAction, "no_show">;
}

export function useTransitionTicket(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: TransitionVariables) =>
      transitionTicket(id, action),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["host-queue", slug] });
    },
  });
}
