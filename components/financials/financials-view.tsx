"use client"

import { ProjectFinancialsTable } from "@/components/financials/project-financials-table"
import { TransactionsTable } from "@/components/financials/transactions-table"
import { useFinancials } from "@/hooks/use-financials"

export function FinancialsView() {
  const { data: financials } = useFinancials()

  return (
    <div className="flex flex-col gap-4">
      <ProjectFinancialsTable projects={financials.projects} />
      {/* Transactions run oldest to newest, as in the design. */}
      <TransactionsTable transactions={financials.transactions} />
    </div>
  )
}
