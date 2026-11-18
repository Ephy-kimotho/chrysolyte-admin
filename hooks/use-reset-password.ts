import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { confirmPasswordReset } from "@/lib/api/auth"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ResetPasswordFormValues } from "@/lib/types/auth"
import { LOGIN_ROUTE } from "@/providers/auth-provider"

interface ResetPasswordOptions {
  data: ResetPasswordFormValues
  /** From the `token` search param of the emailed reset link. */
  token: string
}

/** Sets a new password from an emailed reset link, then opens login. */
export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ data, token }: ResetPasswordOptions) =>
      confirmPasswordReset(token, data.password),
    onSuccess: () => {
      notifySuccess(
        "Password reset",
        "Sign in with your new password to continue."
      )
      router.replace(LOGIN_ROUTE)
    },
    onError: (error) => notifyError("Couldn't reset your password", error),
  })
}
