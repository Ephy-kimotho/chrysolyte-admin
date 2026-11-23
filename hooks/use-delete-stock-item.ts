import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectStoreItemsQueryKey } from "@/hooks/use-project-store-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ProjectStoreItem } from "@/lib/types/stores"

interface DeleteStockItemOptions {
  storeItem: Pick<ProjectStoreItem, "id" | "projectId" | "item">
}

/** Removes an item from a project's site store. */
export function useDeleteStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeItem }: DeleteStockItemOptions) =>
      storesApi.deleteStockItem(storeItem.id),
    onSuccess: (_, { storeItem }) => {
      notifySuccess(
        "Stock item deleted",
        `${storeItem.item} is no longer in the store.`
      )
      return queryClient.invalidateQueries({
        queryKey: projectStoreItemsQueryKey(storeItem.projectId),
      })
    },
    onError: (error) => notifyError("Couldn't delete the stock item", error),
  })
}
