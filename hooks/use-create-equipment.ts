import { useMutation, useQueryClient } from "@tanstack/react-query"

import { storesQueryKey } from "@/hooks/use-stores"
import * as storesApi from "@/lib/mock/stores"
import type { CreateEquipmentFormValues } from "@/lib/types/stores"

interface CreateEquipmentOptions {
  data: CreateEquipmentFormValues
}

/** Adds equipment or tools to the equipment store. */
export function useCreateEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateEquipmentOptions) =>
      storesApi.createEquipment(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: storesQueryKey }),
  })
}
