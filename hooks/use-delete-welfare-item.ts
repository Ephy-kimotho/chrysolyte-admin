import { useMutation, useQueryClient } from "@tanstack/react-query"

import { welfareItemsQueryKey } from "@/hooks/use-welfare-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { WelfareItem } from "@/lib/types/stores"

interface DeleteWelfareItemOptions {
  welfareItem: Pick<WelfareItem, "id" | "item">
}

/** Removes an item from the welfare stores. */
export function useDeleteWelfareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ welfareItem }: DeleteWelfareItemOptions) =>
      storesApi.deleteWelfareItem(welfareItem.id),
    onSuccess: (_, { welfareItem }) => {
      notifySuccess(
        "Welfare item deleted",
        `${welfareItem.item} is no longer in the welfare stores.`
      )
      return queryClient.invalidateQueries({ queryKey: welfareItemsQueryKey })
    },
    onError: (error) => notifyError("Couldn't delete the welfare item", error),
  })
}
