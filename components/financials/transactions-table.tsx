"use client"

import { useMemo, useState } from "react"

import { TransactionActions } from "@/components/financials/transaction-actions"
import { LoadError } from "@/components/load-error"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import {
  TableCard,
  tableCellClassName,
  tableHeadClassName,
} from "@/components/table-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProjects } from "@/hooks/use-projects"
import { useTransactions } from "@/hooks/use-transactions"
import { formatCurrency, formatDate } from "@/lib/format"
import { transactionTypeLabels } from "@/lib/types/financials"
import { cn } from "@/lib/utils"

const columnCount = 6

/** The transaction history, oldest first, optionally for one project. */
export function TransactionsTable() {
  const [projectId, setProjectId] = useState<string>()
  const transactionsQuery = useTransactions({ projectId })
  const transactions = transactionsQuery.data ?? []

  // The API only sends the project's code, so look its name up.
  const { data: projects } = useProjects()
  const projectNames = useMemo(
    () => new Map(projects?.map((project) => [project.id, project.name])),
    [projects]
  )

  return (
    <TableCard
      titleId="transactions-heading"
      title="Transactions"
      titleClassName="text-xl text-heading"
      action={
        <div className="w-full sm:w-64">
          <label htmlFor="transactions-filter-project" className="sr-only">
            Filter by project
          </label>
          <ProjectCombobox
            id="transactions-filter-project"
            value={projectId ?? ""}
            onChange={(option) => setProjectId(option?.value || undefined)}
            placeholder="All projects"
            clearable
          />
        </div>
      }
    >
      {transactionsQuery.isError ? (
        <LoadError
          error={transactionsQuery.error}
          fallback="We couldn't load the transactions."
          onRetry={() => transactionsQuery.refetch()}
          isRetrying={transactionsQuery.isFetching}
        />
      ) : (
        <Table
          // Dimmed while a new filter loads over the previous results.
          aria-busy={transactionsQuery.isPlaceholderData}
          className={cn(
            "min-w-[44rem] transition-opacity",
            transactionsQuery.isPlaceholderData && "opacity-60"
          )}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Date</TableHead>
              <TableHead className={tableHeadClassName}>Project</TableHead>
              <TableHead className={tableHeadClassName}>Type</TableHead>
              <TableHead className={tableHeadClassName}>Description</TableHead>
              <TableHead className={tableHeadClassName}>Amount</TableHead>
              <TableHead className={`${tableHeadClassName} w-12`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsQuery.isPending ? (
              [0, 1].map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={tableCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  {projectId
                    ? "No transactions for this project yet."
                    : "No transactions yet."}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell
                    className={`${tableCellClassName} whitespace-nowrap tabular-nums`}
                  >
                    <time dateTime={transaction.date}>
                      {formatDate(transaction.date)}
                    </time>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {projectNames.get(transaction.projectId) ??
                      transaction.projectId}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {transactionTypeLabels[transaction.type] ??
                      transaction.type}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {transaction.description}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} whitespace-nowrap tabular-nums`}
                  >
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} py-2 text-right`}
                  >
                    <TransactionActions transaction={transaction} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </TableCard>
  )
}
