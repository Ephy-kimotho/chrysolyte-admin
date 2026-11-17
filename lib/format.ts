import { format, parseISO } from "date-fns"

import { isClientUser, type AuthUser } from "@/lib/types/auth"

const numberFormatter = new Intl.NumberFormat("en-KE")
const compactNumberFormatter = new Intl.NumberFormat("en-KE", {
  notation: "compact",
  maximumFractionDigits: 1,
})

/** Formats a plain number with thousands separators, e.g. `1,250` or `12.5`. */
export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

/** Formats an amount in Kenyan shillings, e.g. `KES 26,200`. */
export function formatCurrency(amount: number) {
  return `KES ${numberFormatter.format(amount)}`
}

/** Formats an amount in Kenyan shillings for tight spaces, e.g. `KES 12.5M`. */
export function formatCompactCurrency(amount: number) {
  return `KES ${compactNumberFormatter.format(amount)}`
}

/** A whole-number percentage of `part` in `total`, or 0 when `total` is 0. */
export function percentOf(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

/** Picks the singular or plural form for a count, e.g. `pluralize(1, "notice", "notices")`. */
export function pluralize(count: number, one: string, other: string) {
  return count === 1 ? one : other
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

/** A compact date and time, e.g. `2 Nov 2026, 7:34PM`. Strings are read as ISO. */
export function formatShortDateTime(date: Date | number | string) {
  const value = typeof date === "string" ? parseISO(date) : date
  return format(value, "d MMM yyyy, h:mma")
}

/** Groups a Kenyan phone number for reading, e.g. `0712000001` → `0712 000 001`. */
export function formatPhoneNumber(phone: string) {
  const local = phone.match(/^0(\d{3})(\d{3})(\d{3})$/)
  if (local) return `0${local[1]} ${local[2]} ${local[3]}`
  const international = phone.match(/^\+254(\d{3})(\d{3})(\d{3})$/)
  if (international)
    return `+254 ${international[1]} ${international[2]} ${international[3]}`
  return phone
}

/** The name to show for a signed-in user: the contact person for a client, the full name for staff. */
export function getDisplayName(user: AuthUser) {
  if (isClientUser(user)) {
    return user.contact_name?.trim() || user.name?.trim() || user.email
  }
  return user.full_name?.trim() || user.username?.trim() || user.email
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

/** Seconds as a countdown: 45 → "0:45", 90 → "1:30". */
export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/** Role slugs whose readable name isn't just the slug capitalized. */
const roleLabels: Record<string, string> = {
  projectmanager: "Project manager",
}

/** A role slug as a readable name: "projectmanager" → "Project manager". */
export function formatRole(role: string) {
  return roleLabels[role] ?? humanizeSlug(role)
}
