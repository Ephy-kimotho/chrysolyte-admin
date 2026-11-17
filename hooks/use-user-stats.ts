import { useQuery } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

export const userStatsQueryKey = ["users", "stats"] as const

/** User totals and the number of users in each role. */
export function useUserStats() {
  return useQuery({
    queryKey: userStatsQueryKey,
    queryFn: usersApi.getUserStats,
  })
}
