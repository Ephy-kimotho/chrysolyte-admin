import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import * as clientsApi from "@/lib/api/clients"
import { notifyError, notifySuccess } from "@/lib/notify"
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
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Client added",
        `${data.name} can now be linked to projects.`
      )
      // Refreshes every client list, whatever it's searching for.
      return queryClient.invalidateQueries({ queryKey: clientsQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.name}`, error),
  })
}
