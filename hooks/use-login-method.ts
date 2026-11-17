import { useSyncExternalStore } from "react"

export type LoginMethod = "otp" | "password"

const STORAGE_KEY = "chrysolyte.login-method"
const DEFAULT_METHOD: LoginMethod = "otp"

const listeners = new Set<() => void>()

// Holds the choice for this tab, so switching still works when storage is
// blocked (private windows, cleared site data).
let current: LoginMethod | null = null

function readStoredMethod(): LoginMethod {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "password"
      ? "password"
      : DEFAULT_METHOD
  } catch {
    return DEFAULT_METHOD
  }
}

function getSnapshot() {
  current ??= readStoredMethod()
  return current
}

const getServerSnapshot = () => DEFAULT_METHOD

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function setLoginMethod(method: LoginMethod) {
  current = method
  try {
    window.localStorage.setItem(STORAGE_KEY, method)
  } catch {
    // Storage is a convenience; the in-memory choice still applies.
  }
  listeners.forEach((listener) => listener())
}

/**
 * The sign-in method shown on the login screen, remembered in localStorage so
 * people land on the one they used last. Defaults to the emailed code.
 */
export function useLoginMethod() {
  const method = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return [method, setLoginMethod] as const
}
