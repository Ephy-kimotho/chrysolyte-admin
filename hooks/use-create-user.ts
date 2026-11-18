import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolesQueryOptions } from "@/hooks/use-roles"
import * as usersApi from "@/lib/api/users"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateUserFormValues } from "@/lib/types/users"

interface CreateUserOptions {
  data: CreateUserFormValues
}

/** Adds a user who signs in with a password. */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateUserOptions) => usersApi.createUser(data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "User added",
        `${data.fullName} can sign in once you share their temporary password.`
      )
      // Role counts change: the stats cards and each role's user count.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: rolesQueryOptions.queryKey }),
      ])
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.fullName}`, error),
  })
}
