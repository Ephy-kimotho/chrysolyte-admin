import { useMutation, useQueryClient } from "@tanstack/react-query"

import { equipmentQueryKey } from "@/hooks/use-equipment"
import * as storesApi from "@/lib/api/stores"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { Equipment } from "@/lib/types/stores"

interface DeleteEquipmentOptions {
  equipment: Pick<Equipment, "id" | "item">
}

/** Removes equipment from the equipment store. */
export function useDeleteEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ equipment }: DeleteEquipmentOptions) =>
      storesApi.deleteEquipment(equipment.id),
    onSuccess: (_, { equipment }) => {
      notifySuccess(
        "Equipment deleted",
        `${equipment.item} is no longer in the equipment store.`
      )
      return queryClient.invalidateQueries({ queryKey: equipmentQueryKey })
    },
    onError: (error) => notifyError("Couldn't delete the equipment", error),
  })
}
