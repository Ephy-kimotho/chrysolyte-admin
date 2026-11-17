import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"

interface DeleteClientOptions {
  id: string
}

/** Deletes a client. */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteClientOptions) => clientsApi.deleteClient(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
  })
}
