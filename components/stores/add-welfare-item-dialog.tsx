"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { authInputClassName } from "@/components/auth/styles"
import { storeAddButtonClassName } from "@/components/stores/store-card"
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
import { useCreateWelfareItem } from "@/hooks/use-create-welfare-item"
import { createWelfareItemSchema } from "@/lib/schemas/stores"
import type { CreateWelfareItemFormValues } from "@/lib/types/stores"

const defaultValues: DefaultValues<CreateWelfareItemFormValues> = {
  name: "",
  unit: "",
}

type AddWelfareItemDialogProps = {
  storeId: string
  /** e.g. "Food store". */
  storeName: string
}

export function AddWelfareItemDialog({
  storeId,
  storeName,
}: AddWelfareItemDialogProps) {
  const [open, setOpen] = useState(false)
  const createWelfareItem = useCreateWelfareItem()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWelfareItemFormValues>({
    resolver: zodResolver(createWelfareItemSchema),
    defaultValues,
  })
  const idPrefix = `welfare-item-${storeId}`

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createWelfareItem.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createWelfareItem.reset()
    }
  }

  function onSubmit(data: CreateWelfareItemFormValues) {
    createWelfareItem.mutate(
      { storeId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={storeAddButtonClassName}
          aria-label={`Add item to ${storeName}`}
        >
          <Plus aria-hidden="true" />
          Item
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add to {storeName.toLowerCase()}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            The item shows as low stock when its quantity drops below the
            minimum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createWelfareItem.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the item. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor={`${idPrefix}-name`}>Item</FieldLabel>
              <Input
                id={`${idPrefix}-name`}
                autoComplete="off"
                placeholder="e.g. Maize flour"
                aria-invalid={!!errors.name}
                className={authInputClassName}
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.unit}>
              <FieldLabel htmlFor={`${idPrefix}-unit`}>Unit</FieldLabel>
              <Input
                id={`${idPrefix}-unit`}
                autoComplete="off"
                placeholder="e.g. kg, pcs, packets"
                aria-invalid={!!errors.unit}
                className={authInputClassName}
                {...register("unit")}
              />
              <FieldError>{errors.unit?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor={`${idPrefix}-quantity`}>Quantity</FieldLabel>
              <Input
                id={`${idPrefix}-quantity`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 45"
                aria-invalid={!!errors.quantity}
                className={authInputClassName}
                {...register("quantity", { valueAsNumber: true })}
              />
              <FieldError>{errors.quantity?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.minimum}>
              <FieldLabel htmlFor={`${idPrefix}-minimum`}>Minimum</FieldLabel>
              <Input
                id={`${idPrefix}-minimum`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 20"
                aria-invalid={!!errors.minimum}
                className={authInputClassName}
                {...register("minimum", { valueAsNumber: true })}
              />
              <FieldError>{errors.minimum?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createWelfareItem.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createWelfareItem.isPending}
              className="h-10 rounded-full px-5"
            >
              {createWelfareItem.isPending ? "Adding…" : "Add item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
