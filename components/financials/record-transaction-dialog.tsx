"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { TransactionFormFields } from "@/components/financials/transaction-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateTransaction } from "@/hooks/use-create-transaction"
import { getErrorMessage } from "@/lib/api/errors"
import { createTransactionSchema } from "@/lib/schemas/financials"
import type { CreateTransactionFormValues } from "@/lib/types/financials"

// The date starts on today, the usual case; type and project must be chosen.
function getDefaultValues(): DefaultValues<CreateTransactionFormValues> {
  return {
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
  }
}

export function RecordTransactionDialog() {
  const [open, setOpen] = useState(false)
  const createTransaction = useCreateTransaction()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: getDefaultValues(),
  })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createTransaction.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues())
      createTransaction.reset()
    }
  }

  function onSubmit(data: CreateTransactionFormValues) {
    createTransaction.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 rounded-full px-4 font-semibold">
          <Plus aria-hidden="true" />
          Record transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Record a transaction
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Client receipts count towards what the client has paid. Project
            costs count against the project budget. Partial payments are fine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createTransaction.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createTransaction.error,
                "We couldn't record the transaction. Try again."
              )}
            </p>
          )}

          <TransactionFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="record-transaction"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createTransaction.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createTransaction.isPending}
              className="h-10 rounded-full px-5"
            >
              {createTransaction.isPending
                ? "Recording…"
                : "Record transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
