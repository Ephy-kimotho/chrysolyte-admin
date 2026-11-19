import { useQuery } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"

// Under the staff key, so anything that refreshes the staff lists refreshes
// these counts too.
export const staffDashboardQueryKey = [...staffQueryKey, "dashboard"] as const

/** Staff headcounts: total, active, present and absent today, and restricted. */
export function useStaffDashboard() {
  return useQuery({
    queryKey: staffDashboardQueryKey,
    queryFn: staffApi.getStaffDashboard,
  })
}
