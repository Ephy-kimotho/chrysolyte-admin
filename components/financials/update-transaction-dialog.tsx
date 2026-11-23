"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { TransactionFormFields } from "@/components/financials/transaction-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateTransaction } from "@/hooks/use-update-transaction"
import { getErrorMessage } from "@/lib/api/errors"
import { createTransactionSchema } from "@/lib/schemas/financials"
import type {
  CreateTransactionFormValues,
  FinancialTransaction,
} from "@/lib/types/financials"

type UpdateTransactionDialogProps = {
  transaction: FinancialTransaction
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction()

  function handleOpenChange(nextOpen: boolean) {
    if (updateTransaction.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateTransaction.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update transaction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {transaction.description}.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the transaction's current details. */}
        <UpdateTransactionForm
          transaction={transaction}
          updateTransaction={updateTransaction}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function UpdateTransactionForm({
  transaction,
  updateTransaction,
  onUpdated,
}: {
  transaction: FinancialTransaction
  updateTransaction: ReturnType<typeof useUpdateTransaction>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: transaction.type,
      projectId: transaction.projectId,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
    },
  })

  function onSubmit(data: CreateTransactionFormValues) {
    updateTransaction.mutate({ transaction, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateTransaction.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateTransaction.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <TransactionFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-transaction-${transaction.id}`}
        projectReadOnly
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateTransaction.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateTransaction.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateTransaction.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
