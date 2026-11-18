import { useMutation } from "@tanstack/react-query"

import { requestLoginOtp } from "@/lib/api/auth"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { OtpRequestFormValues } from "@/lib/types/auth"

interface RequestLoginOtpOptions {
  data: OtpRequestFormValues
}

/** Sends a one-time login code to the account's email (and WhatsApp). */
export function useRequestLoginOtp() {
  return useMutation({
    mutationFn: ({ data }: RequestLoginOtpOptions) =>
      requestLoginOtp(data.identifier),
    // The API's message is deliberately vague about whether the account
    // exists, so it's shown as given.
    onSuccess: (response) => notifySuccess("Code sent", response.message),
    onError: (error) => notifyError("Couldn't send a login code", error),
  })
}
