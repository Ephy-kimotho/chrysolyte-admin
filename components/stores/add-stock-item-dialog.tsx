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
import { useCreateStockItem } from "@/hooks/use-create-stock-item"
import { createStockItemSchema } from "@/lib/schemas/stores"
import type { CreateStockItemFormValues } from "@/lib/types/stores"

const defaultValues: DefaultValues<CreateStockItemFormValues> = {
  material: "",
  unit: "",
}

type AddStockItemDialogProps = {
  projectId: string
  /** e.g. "Kilimani Residence material store". */
  storeName: string
}

export function AddStockItemDialog({
  projectId,
  storeName,
}: AddStockItemDialogProps) {
  const [open, setOpen] = useState(false)
  const createStockItem = useCreateStockItem()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStockItemFormValues>({
    resolver: zodResolver(createStockItemSchema),
    defaultValues,
  })
  const idPrefix = `stock-item-${projectId}`

  // Every opening starts with an empty form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createStockItem.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) {
      reset(defaultValues)
      createStockItem.reset()
    }
  }

  function onSubmit(data: CreateStockItemFormValues) {
    createStockItem.mutate(
      { projectId, data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={storeAddButtonClassName}>
          <Plus aria-hidden="true" />
          Stock item
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a stock item
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Adds a material to the {storeName}. It shows as low stock when the
            available quantity drops below the minimum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createStockItem.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              We couldn&apos;t add the stock item. Try again.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.material}>
              <FieldLabel htmlFor={`${idPrefix}-material`}>Material</FieldLabel>
              <Input
                id={`${idPrefix}-material`}
                autoComplete="off"
                placeholder="e.g. Cement"
                aria-invalid={!!errors.material}
                className={authInputClassName}
                {...register("material")}
              />
              <FieldError>{errors.material?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.unit}>
              <FieldLabel htmlFor={`${idPrefix}-unit`}>Unit</FieldLabel>
              <Input
                id={`${idPrefix}-unit`}
                autoComplete="off"
                placeholder="e.g. bags, lengths, metres"
                aria-invalid={!!errors.unit}
                className={authInputClassName}
                {...register("unit")}
              />
              <FieldError>{errors.unit?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.available}>
              <FieldLabel htmlFor={`${idPrefix}-available`}>
                Available
              </FieldLabel>
              <Input
                id={`${idPrefix}-available`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 56"
                aria-invalid={!!errors.available}
                className={authInputClassName}
                {...register("available", { valueAsNumber: true })}
              />
              <FieldError>{errors.available?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.minimum}>
              <FieldLabel htmlFor={`${idPrefix}-minimum`}>Minimum</FieldLabel>
              <Input
                id={`${idPrefix}-minimum`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 60"
                aria-invalid={!!errors.minimum}
                className={authInputClassName}
                {...register("minimum", { valueAsNumber: true })}
              />
              <FieldError>{errors.minimum?.message}</FieldError>
            </Field>

            <Field
              data-invalid={!!errors.forecastNeed}
              className="sm:col-span-2"
            >
              <FieldLabel htmlFor={`${idPrefix}-forecast-need`}>
                Forecast need
              </FieldLabel>
              <Input
                id={`${idPrefix}-forecast-need`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="e.g. 80"
                aria-invalid={!!errors.forecastNeed}
                className={authInputClassName}
                {...register("forecastNeed", { valueAsNumber: true })}
              />
              <FieldError>{errors.forecastNeed?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createStockItem.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createStockItem.isPending}
              className="h-10 rounded-full px-5"
            >
              {createStockItem.isPending ? "Adding…" : "Add stock item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
