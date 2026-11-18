import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteClientOptions {
  id: string
  /** The client's name, for the confirmation toast. */
  name: string
}

/** Deletes a client. */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteClientOptions) => clientsApi.deleteClient(id),
    onSuccess: (_, { name }) => {
      notifySuccess(
        "Client deleted",
        `${name} and their contact details were removed.`
      )
      return queryClient.invalidateQueries({ queryKey: clientsQueryKey })
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
