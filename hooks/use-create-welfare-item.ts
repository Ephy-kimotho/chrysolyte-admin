import { useMutation, useQueryClient } from "@tanstack/react-query"

import { storesQueryKey } from "@/hooks/use-stores"
import * as storesApi from "@/lib/mock/stores"
import type { CreateWelfareItemFormValues } from "@/lib/types/stores"

interface CreateWelfareItemOptions {
  storeId: string
  data: CreateWelfareItemFormValues
}

/** Adds an item to a welfare store (food, beddings or toiletries). */
export function useCreateWelfareItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, data }: CreateWelfareItemOptions) =>
      storesApi.createWelfareItem(storeId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: storesQueryKey }),
  })
}
