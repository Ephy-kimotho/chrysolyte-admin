import { useQuery } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

export const usersQueryKey = ["users", "list"] as const

/** Every user who can sign in. */
export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => usersApi.listUsers(),
  })
}
