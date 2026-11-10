import { format, parseISO } from "date-fns"

const numberFormatter = new Intl.NumberFormat("en-KE")

/** Formats an amount in Kenyan shillings, e.g. `KES 26,200`. */
export function formatCurrency(amount: number) {
  return `KES ${numberFormatter.format(amount)}`
}

/** Formats an ISO date string, e.g. `2026-12-18` → `18 Dec 2026`. */
export function formatDate(isoDate: string) {
  return format(parseISO(isoDate), "d MMM yyyy")
}

/** Formats a date and time, e.g. `Monday, 26 Nov 2026, 12:11PM`. Strings are read as ISO. */
export function formatDateTime(date: Date | number | string) {
  const value = typeof date === "string" ? parseISO(date) : date
  return format(value, "EEEE, d MMM yyyy, h:mma")
}

/** Up to two initials from a name, e.g. "Super Admin" → "SA". */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters =
    words.length > 1 ? [words[0][0], words.at(-1)![0]] : [words[0]?.[0] ?? ""]
  return letters.join("").toUpperCase()
}

/** Turns a role slug into a readable fallback label: "super_admin" → "Super admin". */
export function humanizeSlug(slug: string) {
  const words = slug.replace(/[_-]+/g, " ").trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
