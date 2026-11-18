import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { mustChangePassword, type LoginFormValues } from "@/lib/types/auth"
import { getDisplayName } from "@/lib/format"
import { getHomeRoute } from "@/lib/navigation"
import { notifyError, notifySuccess } from "@/lib/notify"
import { useAuth } from "@/providers/auth-provider"

interface LoginOptions {
  data: LoginFormValues
}

/** Signs the user in through the auth provider, then opens their home page. */
export function useLogin() {
  const { login } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ data }: LoginOptions) => login(data),
    onSuccess: (user) => {
      // A temporary password sends the user to change it before anything else.
      notifySuccess(
        "Signed in",
        mustChangePassword(user)
          ? "Choose a new password to replace your temporary one."
          : `Welcome back, ${getDisplayName(user)}.`
      )
      router.replace(getHomeRoute(user))
    },
    onError: (error) => notifyError("Couldn't sign you in", error),
  })
}
