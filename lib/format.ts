import { format, parseISO } from "date-fns"

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

/** Groups a Kenyan phone number for reading, e.g. `0712000001` → `0712 000 001`. */
export function formatPhoneNumber(phone: string) {
  const local = phone.match(/^0(\d{3})(\d{3})(\d{3})$/)
  if (local) return `0${local[1]} ${local[2]} ${local[3]}`
  const international = phone.match(/^\+254(\d{3})(\d{3})(\d{3})$/)
  if (international)
    return `+254 ${international[1]} ${international[2]} ${international[3]}`
  return phone
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
