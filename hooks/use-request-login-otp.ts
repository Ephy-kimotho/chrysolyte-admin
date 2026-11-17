import { useMutation } from "@tanstack/react-query"

import { requestLoginOtp } from "@/lib/api/auth"
import type { OtpRequestFormValues } from "@/lib/types/auth"

interface RequestLoginOtpOptions {
  data: OtpRequestFormValues
}

/** Sends a one-time login code to the account's email (and WhatsApp). */
export function useRequestLoginOtp() {
  return useMutation({
    mutationFn: ({ data }: RequestLoginOtpOptions) =>
      requestLoginOtp(data.identifier),
  })
}
