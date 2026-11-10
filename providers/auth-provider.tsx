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
import { useRouter } from "next/navigation"
import { WorkspaceLoader } from "@/components/workspace-loader"
import * as authApi from "@/lib/api/auth"
import {
  clearAccessToken,
  getAccessToken,
  subscribeAccessToken,
} from "@/lib/auth-token"
import { onUnauthorized, refreshAccessToken } from "@/lib/axios"
import { dashboardPages } from "@/lib/navigation"
import type { LoginFormValues, AuthUser } from "@/lib/types/auth"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  status: AuthStatus
  isLoggedIn: boolean
  login: (values: LoginFormValues) => Promise<AuthUser>
  logout: () => Promise<void>
  /** Re-fetches `/auth/me` and updates `user` (e.g. after a password change). */
  refreshUser: () => Promise<AuthUser>
}

export const LOGIN_ROUTE = "/login"

/** Where a signed-in user lands after login or when visiting an auth screen. */
export const HOME_ROUTE = "/dashboard"

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
 * Screens under `app/(dashboard)` that need a session. These come from
 * `lib/navigation.ts`, so a page added there is protected automatically.
 */
const PROTECTED_ROUTES = dashboardPages.map((item) => item.href)

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

    const pathname = window.location.pathname

    async function bootstrap() {
      try {
        await refreshAccessToken()
        const profile = await authApi.fetchMe()
        setUser(profile)
        setStatus("authenticated")
        if (pathname === "/" || isPublicRoute(pathname)) {
          router.replace(HOME_ROUTE)
        }
      } catch {
        endSession()
        if (shouldRedirectToLogin(pathname)) router.replace(LOGIN_ROUTE)
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

  const login = useCallback(async (values: LoginFormValues) => {
    await authApi.login(values)
    const profile = await authApi.fetchMe()
    setUser(profile)
    setStatus("authenticated")
    return profile
  }, [])

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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      status,
      isLoggedIn: status === "authenticated" && user !== null,
      login,
      logout,
      refreshUser,
    }),
    [user, accessToken, status, login, logout, refreshUser]
  )

  return (
    <AuthContext.Provider value={value}>
      {status === "loading" ? <WorkspaceLoader /> : children}
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
