import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as cooOperationsApi from "@/lib/api/coo-operations"
import type { OfficeTaskFilters } from "@/lib/types/coo-operations"

/** Prefix shared by every office work log query, filtered or not. */
export const officeTasksQueryKey = ["office-tasks"] as const

/** Lists the office work log, narrowed by `filters`, soonest deadline first. */
export function useOfficeTasks(filters: OfficeTaskFilters = {}) {
  return useQuery({
    queryKey: [...officeTasksQueryKey, filters],
    queryFn: () => cooOperationsApi.listOfficeTasks(filters),
    // Keep showing the last results while a new filter loads.
    placeholderData: keepPreviousData,
  })
}
