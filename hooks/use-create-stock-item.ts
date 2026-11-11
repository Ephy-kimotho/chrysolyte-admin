import { useMutation, useQueryClient } from "@tanstack/react-query"

import { storesQueryKey } from "@/hooks/use-stores"
import * as storesApi from "@/lib/mock/stores"
import type { CreateStockItemFormValues } from "@/lib/types/stores"

interface CreateStockItemOptions {
  projectId: string
  data: CreateStockItemFormValues
}

/** Adds a material to a project's site store. */
export function useCreateStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateStockItemOptions) =>
      storesApi.createStockItem(projectId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: storesQueryKey }),
  })
}
