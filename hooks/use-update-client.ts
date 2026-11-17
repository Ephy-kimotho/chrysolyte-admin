import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"
import type { UpdateClientFormValues } from "@/lib/types/clients"

interface UpdateClientOptions {
  id: string
  data: UpdateClientFormValues
}

/** Updates a client's details. */
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateClientOptions) =>
      clientsApi.updateClient(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
  })
}
