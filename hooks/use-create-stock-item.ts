import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectStoreItemsQueryKey } from "@/hooks/use-project-store-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateStockItemFormValues } from "@/lib/types/stores"

interface CreateStockItemOptions {
  projectId: string
  data: CreateStockItemFormValues
}

/** Adds an item to a project's site store. */
export function useCreateStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateStockItemOptions) =>
      storesApi.createStockItem(projectId, data),
    onSuccess: (_, { projectId, data }) => {
      notifySuccess("Stock item added", `${data.item} is now in the store.`)
      return queryClient.invalidateQueries({
        queryKey: projectStoreItemsQueryKey(projectId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.item}`, error),
  })
}
