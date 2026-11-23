import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as storesApi from "@/lib/api/stores"
import type { EquipmentFilters } from "@/lib/types/stores"

/** Prefix shared by every equipment query, filtered or not. */
export const equipmentQueryKey = ["equipment"] as const

/** Lists equipment and tools by name, narrowed by `filters`. */
export function useEquipment(filters: EquipmentFilters = {}) {
  return useQuery({
    queryKey: [...equipmentQueryKey, filters],
    queryFn: () => storesApi.listEquipment(filters),
    // Keep showing the last results while a new filter loads.
    placeholderData: keepPreviousData,
  })
}
