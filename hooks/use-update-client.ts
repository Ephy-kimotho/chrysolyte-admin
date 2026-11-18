import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"
import { notifyError, notifySuccess } from "@/lib/notify"
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
    onSuccess: (_, { data }) => {
      notifySuccess("Client updated", `${data.name}'s details were saved.`)
      return queryClient.invalidateQueries({ queryKey: clientsQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't update ${data.name}`, error),
  })
}
