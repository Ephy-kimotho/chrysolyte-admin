import { useQuery } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"

// Under the staff key, so assigning a project refreshes this list too.
export function staffAssignmentsQueryKey(staffId: string) {
  return [...staffQueryKey, "assignments", staffId] as const
}

/** Every project a staff member has been assigned to, past ones included. */
export function useStaffAssignments(staffId: string) {
  return useQuery({
    queryKey: staffAssignmentsQueryKey(staffId),
    queryFn: () => staffApi.listStaffAssignments(staffId),
  })
}
