import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectStoreItemsQueryKey } from "@/hooks/use-project-store-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  CreateStockItemFormValues,
  ProjectStoreItem,
} from "@/lib/types/stores"

interface UpdateStockItemOptions {
  storeItem: Pick<ProjectStoreItem, "id" | "projectId">
  data: CreateStockItemFormValues
}

/** Saves changes to an item in a project's site store. */
export function useUpdateStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeItem, data }: UpdateStockItemOptions) =>
      storesApi.updateStockItem(storeItem.id, data),
    onSuccess: (_, { storeItem, data }) => {
      notifySuccess("Stock item updated", `${data.item} has been saved.`)
      return queryClient.invalidateQueries({
        queryKey: projectStoreItemsQueryKey(storeItem.projectId),
      })
    },
    onError: (error) => notifyError("Couldn't update the stock item", error),
  })
}
