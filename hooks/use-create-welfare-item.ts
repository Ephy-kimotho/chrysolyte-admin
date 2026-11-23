import { useMutation, useQueryClient } from "@tanstack/react-query"

import { welfareItemsQueryKey } from "@/hooks/use-welfare-items"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateWelfareItemFormValues } from "@/lib/types/stores"

interface CreateWelfareItemOptions {
  data: CreateWelfareItemFormValues
}

/** Adds an item to a welfare store (food, beddings or toiletries). */
export function useCreateWelfareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateWelfareItemOptions) =>
      storesApi.createWelfareItem(data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Welfare item added",
        `${data.item} is now in the ${data.category.toLowerCase()} store.`
      )
      return queryClient.invalidateQueries({ queryKey: welfareItemsQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.item}`, error),
  })
}
