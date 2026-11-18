import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { getDisplayName } from "@/lib/format"
import { getHomeRoute } from "@/lib/navigation"
import { notifyError, notifySuccess } from "@/lib/notify"
import { useAuth } from "@/providers/auth-provider"

interface VerifyLoginOtpOptions {
  data: {
    identifier: string
    code: string
  }
}

/** Signs the user in with their one-time code, then opens their home page. */
export function useVerifyLoginOtp() {
  const { loginWithOtp } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ data }: VerifyLoginOtpOptions) =>
      loginWithOtp(data.identifier, data.code),
    onSuccess: (user) => {
      notifySuccess("Signed in", `Welcome back, ${getDisplayName(user)}.`)
      router.replace(getHomeRoute(user))
    },
    onError: (error) => notifyError("Couldn't verify your code", error),
  })
}
