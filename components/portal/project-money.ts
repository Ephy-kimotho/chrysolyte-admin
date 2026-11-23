import { formatCurrency } from "@/lib/format"
import type { PortalProject } from "@/lib/types/portal"

/** The contract value, or a note when it hasn't been set (the API sends 0). */
export function formatContractValue(
  project: Pick<PortalProject, "contractValue">
) {
  return project.contractValue > 0
    ? formatCurrency(project.contractValue)
    : "Not set yet"
}

/**
 * What's left to pay. Without a contract value the API's balance is just the
 * payments made, negated, so it isn't shown.
 */
export function formatBalance(
  project: Pick<PortalProject, "contractValue" | "balance">
) {
  if (project.contractValue <= 0) return "—"
  if (project.balance > 0) return formatCurrency(project.balance)
  if (project.balance === 0) return "Paid in full"
  return `${formatCurrency(-project.balance)} in credit`
}
