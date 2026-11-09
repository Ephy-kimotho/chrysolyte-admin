import * as React from "react"

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  let timeout: ReturnType<typeof setTimeout>

  // Wake at the start of each minute rather than polling.
  const schedule = () => {
    timeout = setTimeout(
      () => {
        onChange()
        schedule()
      },
      MINUTE - (Date.now() % MINUTE)
    )
  }

  schedule()
  return () => clearTimeout(timeout)
}

// Rounded down to the minute so the snapshot stays stable between ticks.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE

const getServerSnapshot = () => null

/**
 * The current time, rounded down to the minute, as a timestamp. Returns `null`
 * on the server and during hydration, so server and client markup match.
 */
export function useCurrentMinute() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
