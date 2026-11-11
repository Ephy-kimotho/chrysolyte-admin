import {
  FinancialsTableCard,
  financialsCellClassName,
  financialsHeadClassName,
} from "@/components/financials/financials-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import type { FinancialTransaction } from "@/lib/types/financials"

type TransactionsTableProps = {
  transactions: FinancialTransaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <FinancialsTableCard
      titleId="transactions-heading"
      title="Transactions"
      titleClassName="pt-2 text-lg"
    >
      <Table className="min-w-[40rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={financialsHeadClassName}>Date</TableHead>
            <TableHead className={financialsHeadClassName}>Project</TableHead>
            <TableHead className={financialsHeadClassName}>Type</TableHead>
            <TableHead className={financialsHeadClassName}>
              Description
            </TableHead>
            <TableHead className={financialsHeadClassName}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No transactions yet.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  <time dateTime={transaction.date}>{transaction.date}</time>
                </TableCell>
                <TableCell className={financialsCellClassName}>
                  {transaction.projectName}
                </TableCell>
                <TableCell className={financialsCellClassName}>
                  {transaction.type}
                </TableCell>
                <TableCell className={financialsCellClassName}>
                  {transaction.description}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} whitespace-nowrap tabular-nums`}
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </FinancialsTableCard>
  )
}
