"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { WelfareItemFormFields } from "@/components/stores/welfare-item-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateWelfareItem } from "@/hooks/use-update-welfare-item"
import { getErrorMessage } from "@/lib/api/errors"
import { createWelfareItemSchema } from "@/lib/schemas/stores"
import {
  isWelfareCategory,
  type CreateWelfareItemFormValues,
  type WelfareItem,
} from "@/lib/types/stores"

type UpdateWelfareItemDialogProps = {
  welfareItem: WelfareItem
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateWelfareItemDialog({
  welfareItem,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateWelfareItemDialogProps) {
  const updateWelfareItem = useUpdateWelfareItem()

  function handleOpenChange(nextOpen: boolean) {
    if (updateWelfareItem.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateWelfareItem.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update welfare item
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the stock on record for {welfareItem.item}, e.g. after a
            delivery or once supplies are used.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the item's current details. */}
        <UpdateWelfareItemForm
          welfareItem={welfareItem}
          updateWelfareItem={updateWelfareItem}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function UpdateWelfareItemForm({
  welfareItem,
  updateWelfareItem,
  onUpdated,
}: {
  welfareItem: WelfareItem
  updateWelfareItem: ReturnType<typeof useUpdateWelfareItem>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWelfareItemFormValues>({
    resolver: zodResolver(createWelfareItemSchema),
    defaultValues: {
      // An unknown category is left blank, so a valid one has to be chosen.
      category: isWelfareCategory(welfareItem.category)
        ? welfareItem.category
        : undefined,
      item: welfareItem.item,
      unit: welfareItem.unit,
      qty: welfareItem.quantity,
      minQty: welfareItem.minimum,
    },
  })

  function onSubmit(data: CreateWelfareItemFormValues) {
    updateWelfareItem.mutate({ welfareItem, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateWelfareItem.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateWelfareItem.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <WelfareItemFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-welfare-item-${welfareItem.id}`}
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateWelfareItem.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateWelfareItem.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateWelfareItem.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
