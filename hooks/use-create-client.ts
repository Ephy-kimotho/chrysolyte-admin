import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"
import type { CreateClientFormValues } from "@/lib/types/clients"

interface CreateClientOptions {
  data: CreateClientFormValues
}

/** Adds a client. */
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateClientOptions) =>
      clientsApi.createClient(data),
    // Refreshes every client list, whatever it's searching for.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
  })
}
