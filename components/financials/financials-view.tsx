"use client"

import { RecordTransactionDialog } from "@/components/financials/record-transaction-dialog"
import { TransactionsTable } from "@/components/financials/transactions-table"

export function FinancialsView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <RecordTransactionDialog />
      </div>
      {/* Transactions run oldest to newest, as in the design. */}
      <TransactionsTable />
    </div>
  )
}
