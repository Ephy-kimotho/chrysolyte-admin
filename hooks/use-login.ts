import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { LoginFormValues } from "@/lib/types/auth"
import { HOME_ROUTE, useAuth } from "@/providers/auth-provider"

interface LoginOptions {
  data: LoginFormValues
}

/** Signs the user in through the auth provider, then opens the dashboard. */
export function useLogin() {
  const { login } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ data }: LoginOptions) => login(data),
    onSuccess: () => {
      router.replace(HOME_ROUTE)
    },
  })
}
