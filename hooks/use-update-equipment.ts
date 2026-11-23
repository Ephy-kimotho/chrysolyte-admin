import { useMutation, useQueryClient } from "@tanstack/react-query"

import { equipmentQueryKey } from "@/hooks/use-equipment"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateEquipmentFormValues, Equipment } from "@/lib/types/stores"

interface UpdateEquipmentOptions {
  equipment: Pick<Equipment, "id">
  data: CreateEquipmentFormValues
}

/** Saves changes to equipment in the equipment store. */
export function useUpdateEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ equipment, data }: UpdateEquipmentOptions) =>
      storesApi.updateEquipment(equipment.id, data),
    onSuccess: (_, { data }) => {
      notifySuccess("Equipment updated", `${data.item} has been saved.`)
      return queryClient.invalidateQueries({ queryKey: equipmentQueryKey })
    },
    onError: (error) => notifyError("Couldn't update the equipment", error),
  })
}
