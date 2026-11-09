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

/** Formats a date and time, e.g. `Monday, 26 Nov 2026, 12:11PM`. */
export function formatDateTime(date: Date | number) {
  return format(date, "EEEE, d MMM yyyy, h:mma")
}
