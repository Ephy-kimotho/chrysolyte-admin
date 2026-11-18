import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { notifyError, notifySuccess } from "@/lib/notify"
import { LOGIN_ROUTE, useAuth } from "@/providers/auth-provider"

/**
 * Signs the user out and returns them to login. The local session ends even if
 * the logout request fails, so the redirect runs either way.
 */
export function useLogout() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onSuccess: () =>
      notifySuccess("Signed out", "You've been signed out of FirmControl."),
    // The session here has still ended; the server may not know yet.
    onError: (error) => notifyError("Signed out on this device only", error),
    onSettled: () => {
      // Drop cached data so the next account to sign in never sees it.
      queryClient.clear()
      router.replace(LOGIN_ROUTE)
    },
  })
}
