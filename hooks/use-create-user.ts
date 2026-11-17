import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolesQueryOptions } from "@/hooks/use-roles"
import * as usersApi from "@/lib/api/users"
import type { CreateUserFormValues } from "@/lib/types/users"

interface CreateUserOptions {
  data: CreateUserFormValues
}

/** Adds a user who signs in with a password. */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateUserOptions) => usersApi.createUser(data),
    // Role counts change: the stats cards and each role's user count.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: rolesQueryOptions.queryKey }),
      ]),
  })
}
