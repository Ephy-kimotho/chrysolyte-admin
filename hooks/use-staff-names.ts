import { useMemo } from "react"

import { useStaff } from "@/hooks/use-staff"

/**
 * Staff names by id, from the cached staff list. Inactive staff are included,
 * so someone already assigned to a project still shows by name.
 */
export function useStaffNames() {
  const { data: staff } = useStaff()

  return useMemo(
    () => new Map(staff?.map((member) => [member.id, member.fullName])),
    [staff]
  )
}
