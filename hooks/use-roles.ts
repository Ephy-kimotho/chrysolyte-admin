import { queryOptions, useQuery } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

/** Shared with `prefetchQuery`, so a prefetched list is the one `useRoles` reads. */
export const rolesQueryOptions = queryOptions({
  queryKey: ["roles"],
  // Looked up per call, not when this module loads, so a hot-reloaded API
  // module is always the one used.
  queryFn: () => usersApi.listRoles(),
})

/** Every role a user can be given. */
export function useRoles() {
  return useQuery(rolesQueryOptions)
}
