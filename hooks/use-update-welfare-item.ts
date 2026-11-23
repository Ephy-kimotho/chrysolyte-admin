import { useMutation, useQueryClient } from "@tanstack/react-query"

import { welfareItemsQueryKey } from "@/hooks/use-welfare-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  CreateWelfareItemFormValues,
  WelfareItem,
} from "@/lib/types/stores"

interface UpdateWelfareItemOptions {
  welfareItem: Pick<WelfareItem, "id">
  data: CreateWelfareItemFormValues
}

/** Saves changes to a welfare store item. */
export function useUpdateWelfareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ welfareItem, data }: UpdateWelfareItemOptions) =>
      storesApi.updateWelfareItem(welfareItem.id, data),
    onSuccess: (_, { data }) => {
      notifySuccess("Welfare item updated", `${data.item} has been saved.`)
      return queryClient.invalidateQueries({ queryKey: welfareItemsQueryKey })
    },
    onError: (error) => notifyError("Couldn't update the welfare item", error),
  })
}
