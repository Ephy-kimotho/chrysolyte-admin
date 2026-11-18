import { useMutation } from "@tanstack/react-query"

import * as authApi from "@/lib/api/auth"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ChangePasswordFormValues } from "@/lib/types/auth"
import { useAuth } from "@/providers/auth-provider"

interface ChangePasswordOptions {
  data: ChangePasswordFormValues
}

/** Changes the signed-in user's password, then reloads their profile. */
export function useChangePassword() {
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: ({ data }: ChangePasswordOptions) =>
      authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      notifySuccess(
        "Password changed",
        "Use your new password the next time you sign in."
      )
      // The profile carries `must_change_password`, which this can clear.
      return refreshUser()
    },
    onError: (error) => notifyError("Couldn't change your password", error),
  })
}
