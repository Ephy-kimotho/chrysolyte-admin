import { useQuery } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/mock/staff"

/**
 * One staff member, or null if there's no one with that id. It reads from the
 * same cached list as `useStaff`, so adding or removing staff updates both.
 */
export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffQueryKey,
    queryFn: staffApi.listStaff,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: staffApi.getStaffSnapshot,
    select: (staff) => staff.find((member) => member.id === id) ?? null,
  })
}
