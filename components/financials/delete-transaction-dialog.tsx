"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteTransaction } from "@/hooks/use-delete-transaction"
import { getErrorMessage } from "@/lib/api/errors"
import { formatCurrency } from "@/lib/format"
import {
  transactionTypeLabels,
  type FinancialTransaction,
} from "@/lib/types/financials"

type DeleteTransactionDialogProps = {
  transaction: Pick<
    FinancialTransaction,
    "id" | "description" | "type" | "amount"
  >
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteTransactionDialogProps) {
  const deleteTransaction = useDeleteTransaction()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteTransaction.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteTransaction.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteTransaction.mutate(
      { transaction },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const typeLabel =
    transactionTypeLabels[transaction.type]?.toLowerCase() ?? "transaction"

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete this transaction?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            The {formatCurrency(transaction.amount)} {typeLabel} for{" "}
            {transaction.description} will be removed, and the project&apos;s
            totals will change. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteTransaction.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteTransaction.error,
              "We couldn't delete this transaction. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteTransaction.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteTransaction.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteTransaction.isPending ? "Deleting…" : "Delete transaction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
