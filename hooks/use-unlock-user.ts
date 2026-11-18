import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"
import { notifyError, notifySuccess } from "@/lib/notify"

interface UnlockUserOptions {
  userId: string
  /** The user's name, for the confirmation toast. */
  name: string
}

/** Lifts a lock from too many failed sign-in attempts. */
export function useUnlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: UnlockUserOptions) => usersApi.unlockUser(userId),
    onSuccess: (_, { name }) => {
      notifySuccess("User unlocked", `${name} can sign in again straight away.`)
      return queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error, { name }) => notifyError(`Couldn't unlock ${name}`, error),
  })
}
