import { useQuery } from "@tanstack/react-query"

import * as staffApi from "@/lib/mock/staff"

export const staffQueryKey = ["staff"] as const

/** Lists every staff member with their KPIs and activity. */
export function useStaff() {
  return useQuery({
    queryKey: staffQueryKey,
    queryFn: staffApi.listStaff,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: staffApi.getStaffSnapshot,
  })
}
