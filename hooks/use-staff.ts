import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as staffApi from "@/lib/api/staff"
import type { StaffFilters } from "@/lib/types/staff"

export const staffQueryKey = ["staff"] as const

/** The query for a staff list; shared so other hooks can read the same cache. */
export function staffQueryOptions(filters: StaffFilters = {}) {
  return {
    queryKey: [...staffQueryKey, filters],
    queryFn: () => staffApi.listStaff(filters),
  }
}

/** Lists staff, optionally filtered by division or to active staff only. */
export function useStaff(filters: StaffFilters = {}) {
  return useQuery({
    ...staffQueryOptions(filters),
    // Keep showing the last list while a new filter loads.
    placeholderData: keepPreviousData,
  })
}
