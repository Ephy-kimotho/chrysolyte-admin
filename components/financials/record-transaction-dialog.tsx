"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Controller, useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { DatePicker } from "@/components/date-picker"
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateTransaction } from "@/hooks/use-create-transaction"
import { useProjects } from "@/hooks/use-projects"
import { createTransactionSchema } from "@/lib/schemas/financials"
import {
  transactionTypes,
  type CreateTransactionFormValues,
} from "@/lib/types/financials"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

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
  const { data: projects } = useProjects()
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
        <Button className="h-11 rounded-xl px-4 font-semibold">
          <Plus aria-hidden="true" />
          Financial activity
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Record a financial activity
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
              We couldn&apos;t record the activity. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="transaction-type">Type</FieldLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    // "" shows the placeholder again after the form resets.
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="transaction-type"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.type}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.type?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.projectId}>
              <FieldLabel htmlFor="transaction-project">Project</FieldLabel>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="transaction-project"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={!!errors.projectId}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.projectId?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="transaction-amount">Amount (KES)</FieldLabel>
              <Input
                id="transaction-amount"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="e.g. 250000"
                aria-invalid={!!errors.amount}
                className={authInputClassName}
                {...register("amount", { valueAsNumber: true })}
              />
              <FieldError>{errors.amount?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="transaction-date">Date</FieldLabel>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    id="transaction-date"
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    maxDate={new Date()}
                    placeholder="Choose the date"
                    aria-invalid={!!errors.date}
                  />
                )}
              />
              <FieldError>{errors.date?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.description}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor="transaction-description">
                Description
              </FieldLabel>
              <Input
                id="transaction-description"
                autoComplete="off"
                placeholder="e.g. Cement and reinforcement"
                aria-invalid={!!errors.description}
                className={authInputClassName}
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
          </div>

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
              {createTransaction.isPending ? "Recording…" : "Record activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
