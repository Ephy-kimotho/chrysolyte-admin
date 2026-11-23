"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { storeAddButtonClassName } from "@/components/stores/store-card"
import { WelfareItemFormFields } from "@/components/stores/welfare-item-form-fields"
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
import { useCreateWelfareItem } from "@/hooks/use-create-welfare-item"
import { getErrorMessage } from "@/lib/api/errors"
import { createWelfareItemSchema } from "@/lib/schemas/stores"
import type {
  CreateWelfareItemFormValues,
  WelfareCategory,
} from "@/lib/types/stores"

function getDefaultValues(
  category?: WelfareCategory
): DefaultValues<CreateWelfareItemFormValues> {
  return { category, item: "", unit: "" }
}

type AddWelfareItemDialogProps = {
  /** Starts the form on this category, e.g. the one being viewed. */
  defaultCategory?: WelfareCategory
}

export function AddWelfareItemDialog({
  defaultCategory,
}: AddWelfareItemDialogProps) {
  const [open, setOpen] = useState(false)
  const createWelfareItem = useCreateWelfareItem()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWelfareItemFormValues>({
    resolver: zodResolver(createWelfareItemSchema),
    defaultValues: getDefaultValues(defaultCategory),
  })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createWelfareItem.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues(defaultCategory))
      createWelfareItem.reset()
    }
  }

  function onSubmit(data: CreateWelfareItemFormValues) {
    createWelfareItem.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={storeAddButtonClassName}>
          <Plus aria-hidden="true" />
          Welfare item
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add a welfare item
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Adds food, beddings or toiletries to the welfare stores. It shows as
            low stock when the quantity drops below the minimum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createWelfareItem.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createWelfareItem.error,
                "We couldn't add the item. Try again."
              )}
            </p>
          )}

          <WelfareItemFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="add-welfare-item"
          />

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
