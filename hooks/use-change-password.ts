import { useMutation } from "@tanstack/react-query"

import * as authApi from "@/lib/api/auth"
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
    // The profile carries `must_change_password`, which this can clear.
    onSuccess: () => refreshUser(),
  })
}
