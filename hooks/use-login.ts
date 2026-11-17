import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { LoginFormValues } from "@/lib/types/auth"
import { getHomeRoute } from "@/lib/navigation"
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
      router.replace(getHomeRoute(user))
    },
  })
}
