"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { WorkspaceLoader } from "@/components/workspace-loader"
import * as authApi from "@/lib/api/auth"
import {
  clearAccessToken,
  getAccessToken,
  subscribeAccessToken,
} from "@/lib/auth-token"
import { onUnauthorized, refreshAccessToken } from "@/lib/axios"
import {
  CHANGE_PASSWORD_ROUTE,
  canAccessPage,
  dashboardPages,
  getHomeRoute,
} from "@/lib/navigation"
import {
  isClientUser,
  type AuthUser,
  type LoginFormValues,
} from "@/lib/types/auth"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  status: AuthStatus
  isLoggedIn: boolean
  /** Signed in as a client account, which only sees its projects. */
  isClient: boolean
  login: (values: LoginFormValues) => Promise<AuthUser>
  /** Signs in with an emailed one-time code instead of a password. */
  loginWithOtp: (identifier: string, code: string) => Promise<AuthUser>
  logout: () => Promise<void>
  /** Re-fetches `/auth/me` and updates `user` (e.g. after a password change). */
  refreshUser: () => Promise<AuthUser>
}

export const LOGIN_ROUTE = "/login"

/** Screens under `app/(auth)`, reachable without a session. */
const PUBLIC_ROUTES = [LOGIN_ROUTE, "/forgot-password", "/reset-password"]

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function isPublicRoute(pathname: string) {
  return matchesRoute(pathname, PUBLIC_ROUTES)
}

/**
 * Screens that need a session: those under `app/(dashboard)`, which come from
 * `lib/navigation.ts` so a page added there is protected automatically, plus
 * the change-password screen.
 */
const PROTECTED_ROUTES = [
  ...dashboardPages.map((item) => item.href),
  CHANGE_PASSWORD_ROUTE,
]

/**
 * Whether the path is a real route. Anything else is a 404, which renders its
 * own screen instead of bouncing a signed-out visitor to login.
 */
export function isAppRoute(pathname: string) {
  return (
    pathname === "/" ||
    isPublicRoute(pathname) ||
    matchesRoute(pathname, PROTECTED_ROUTES)
  )
}

/** Signed-out visitors are sent to login from real routes only, never from a 404. */
function shouldRedirectToLogin(pathname: string) {
  return isAppRoute(pathname) && !isPublicRoute(pathname)
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const getServerToken = () => null

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")
  const bootstrapped = useRef(false)

  // Mirrors the module-level token, so consumers re-render when the axios
  // interceptor refreshes it behind the scenes.
  const accessToken = useSyncExternalStore(
    subscribeAccessToken,
    getAccessToken,
    getServerToken
  )

  const endSession = useCallback(() => {
    clearAccessToken()
    setUser(null)
    setStatus("unauthenticated")
  }, [])

  // On load: trade the refresh cookie for an access token, load the profile,
  // then send the visitor to the right place.
  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    const startPath = window.location.pathname

    async function bootstrap() {
      try {
        await refreshAccessToken()
        const profile = await authApi.fetchMe()
        setUser(profile)
        setStatus("authenticated")
        if (startPath === "/" || isPublicRoute(startPath)) {
          router.replace(getHomeRoute(profile))
        }
      } catch {
        endSession()
        if (shouldRedirectToLogin(startPath)) router.replace(LOGIN_ROUTE)
      }
    }

    void bootstrap()
  }, [router, endSession])

  // A refresh that fails mid-session (cookie expired or revoked) ends it.
  useEffect(() => {
    return onUnauthorized(() => {
      endSession()
      if (shouldRedirectToLogin(window.location.pathname)) {
        router.replace(LOGIN_ROUTE)
      }
    })
  }, [router, endSession])

  // Both sign-in methods store the token first, then load the profile.
  const startSession = useCallback(async () => {
    const profile = await authApi.fetchMe()
    setUser(profile)
    setStatus("authenticated")
    return profile
  }, [])

  const login = useCallback(
    async (values: LoginFormValues) => {
      await authApi.login(values)
      return startSession()
    },
    [startSession]
  )

  const loginWithOtp = useCallback(
    async (identifier: string, code: string) => {
      await authApi.verifyLoginOtp(identifier, code)
      return startSession()
    },
    [startSession]
  )

  const refreshUser = useCallback(async () => {
    const profile = await authApi.fetchMe()
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      endSession()
    }
  }, [endSession])

  // A signed-in user on a page their account can't open, e.g. a client on
  // /dashboard. They're sent home, and the page never renders meanwhile.
  const isOffLimits =
    user !== null &&
    isAppRoute(pathname) &&
    !isPublicRoute(pathname) &&
    !canAccessPage(user, pathname)

  useEffect(() => {
    if (isOffLimits && user) router.replace(getHomeRoute(user))
  }, [isOffLimits, user, router])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      status,
      isLoggedIn: status === "authenticated" && user !== null,
      isClient: user !== null && isClientUser(user),
      login,
      loginWithOtp,
      logout,
      refreshUser,
    }),
    [user, accessToken, status, login, loginWithOtp, logout, refreshUser]
  )

  return (
    <AuthContext.Provider value={value}>
      {status === "loading" || isOffLimits ? <WorkspaceLoader /> : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
