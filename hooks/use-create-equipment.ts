import { useMutation, useQueryClient } from "@tanstack/react-query"

import { equipmentQueryKey } from "@/hooks/use-equipment"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
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
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Equipment added",
        `${data.item} (${data.assetNumber}) is now in the equipment store.`
      )
      return queryClient.invalidateQueries({ queryKey: equipmentQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.item}`, error),
  })
}
