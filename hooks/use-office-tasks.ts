import { useQuery } from "@tanstack/react-query"

import * as cooOperationsApi from "@/lib/mock/coo-operations"

export const officeTasksQueryKey = ["office-tasks"] as const

/** Lists the office work log, soonest deadline first. */
export function useOfficeTasks() {
  return useQuery({
    queryKey: officeTasksQueryKey,
    queryFn: cooOperationsApi.listOfficeTasks,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: cooOperationsApi.getOfficeTasksSnapshot,
  })
}
