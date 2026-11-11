import {
  TableCard,
  tableCellClassName,
  tableHeadClassName,
} from "@/components/table-card"
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
    <TableCard
      titleId="transactions-heading"
      title="Transactions"
      titleClassName="pt-2 text-lg"
    >
      <Table className="min-w-[40rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Date</TableHead>
            <TableHead className={tableHeadClassName}>Project</TableHead>
            <TableHead className={tableHeadClassName}>Type</TableHead>
            <TableHead className={tableHeadClassName}>Description</TableHead>
            <TableHead className={tableHeadClassName}>Amount</TableHead>
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
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  <time dateTime={transaction.date}>{transaction.date}</time>
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {transaction.projectName}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {transaction.type}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {transaction.description}
                </TableCell>
                <TableCell
                  className={`${tableCellClassName} whitespace-nowrap tabular-nums`}
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
