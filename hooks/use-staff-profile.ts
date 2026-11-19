import { useQuery } from "@tanstack/react-query"
import { isAxiosError } from "axios"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"

export function staffProfileQueryKey(staffId: string) {
  return [...staffQueryKey, "profile", staffId] as const
}

/** True when the API says there's no staff member with that id. */
export function isStaffNotFound(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404
}

/** One staff member's profile, fetched by id. */
export function useStaffProfile(staffId: string) {
  return useQuery({
    queryKey: staffProfileQueryKey(staffId),
    queryFn: () => staffApi.getStaffProfile(staffId),
    // A missing staff member won't appear on a retry.
    retry: (failureCount, error) => !isStaffNotFound(error) && failureCount < 3,
  })
}
