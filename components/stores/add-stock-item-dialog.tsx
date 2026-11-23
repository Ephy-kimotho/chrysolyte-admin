"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { StockItemFormFields } from "@/components/stores/stock-item-form-fields"
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
import { useCreateStockItem } from "@/hooks/use-create-stock-item"
import { getErrorMessage } from "@/lib/api/errors"
import { createStockItemSchema } from "@/lib/schemas/stores"
import type { CreateStockItemFormValues } from "@/lib/types/stores"

const defaultValues: DefaultValues<CreateStockItemFormValues> = {
  item: "",
  unit: "",
  supplier: "",
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
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStockItemFormValues>({
    resolver: zodResolver(createStockItemSchema),
    defaultValues,
  })

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
            Adds an item to the {storeName}. It shows as low stock when the
            quantity drops below the minimum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createStockItem.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createStockItem.error,
                "We couldn't add the stock item. Try again."
              )}
            </p>
          )}

          <StockItemFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix={`stock-item-${projectId}`}
          />

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
