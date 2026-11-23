"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { StockItemFormFields } from "@/components/stores/stock-item-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateStockItem } from "@/hooks/use-update-stock-item"
import { getErrorMessage } from "@/lib/api/errors"
import { createStockItemSchema } from "@/lib/schemas/stores"
import type {
  CreateStockItemFormValues,
  ProjectStoreItem,
} from "@/lib/types/stores"

type UpdateStockItemDialogProps = {
  storeItem: ProjectStoreItem
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateStockItemDialog({
  storeItem,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateStockItemDialogProps) {
  const updateStockItem = useUpdateStockItem()

  function handleOpenChange(nextOpen: boolean) {
    if (updateStockItem.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateStockItem.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update stock item
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the stock on record for {storeItem.item}, e.g. after a
            delivery or once materials are used on site.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the item's current details. */}
        <UpdateStockItemForm
          storeItem={storeItem}
          updateStockItem={updateStockItem}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function UpdateStockItemForm({
  storeItem,
  updateStockItem,
  onUpdated,
}: {
  storeItem: ProjectStoreItem
  updateStockItem: ReturnType<typeof useUpdateStockItem>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStockItemFormValues>({
    resolver: zodResolver(createStockItemSchema),
    defaultValues: {
      item: storeItem.item,
      supplier: storeItem.supplier,
      unit: storeItem.unit,
      qty: storeItem.quantity,
      minQty: storeItem.minimum,
    },
  })

  function onSubmit(data: CreateStockItemFormValues) {
    updateStockItem.mutate({ storeItem, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateStockItem.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateStockItem.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <StockItemFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-stock-item-${storeItem.id}`}
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateStockItem.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateStockItem.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateStockItem.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
