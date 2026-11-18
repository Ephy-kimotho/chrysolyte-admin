import { useMutation } from "@tanstack/react-query"

import { requestPasswordReset } from "@/lib/api/auth"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ForgotPasswordFormValues } from "@/lib/types/auth"

interface RequestPasswordResetOptions {
  data: ForgotPasswordFormValues
}

/** Emails a password reset link to the account, if the email is registered. */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: ({ data }: RequestPasswordResetOptions) =>
      requestPasswordReset(data.email),
    // The API's message is deliberately vague about whether the account
    // exists, so it's shown as given.
    onSuccess: (response) =>
      notifySuccess("Check your email", response.message),
    onError: (error) => notifyError("Couldn't send a reset link", error),
  })
}
