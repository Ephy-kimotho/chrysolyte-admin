"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useForm, type DefaultValues } from "react-hook-form"

import { EquipmentFormFields } from "@/components/stores/equipment-form-fields"
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
import { useCreateEquipment } from "@/hooks/use-create-equipment"
import { getErrorMessage } from "@/lib/api/errors"
import { createEquipmentSchema } from "@/lib/schemas/stores"
import type { CreateEquipmentFormValues } from "@/lib/types/stores"

// Category must be chosen. New equipment usually starts in good condition,
// in the general store, issued today.
function getDefaultValues(): DefaultValues<CreateEquipmentFormValues> {
  return {
    assetNumber: "",
    item: "",
    qty: 1,
    condition: "Good",
    assignedProjectId: "",
    responsibleId: "",
    issuedDate: format(new Date(), "yyyy-MM-dd"),
    returnDate: "",
    purchaseCost: null,
    maintenanceNotes: "",
  }
}

export function AddEquipmentDialog() {
  const [open, setOpen] = useState(false)
  const createEquipment = useCreateEquipment()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEquipmentFormValues>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues: getDefaultValues(),
  })

  // Every opening starts with a fresh form and no leftover error.
  function handleOpenChange(nextOpen: boolean) {
    if (createEquipment.isPending) return
    setOpen(nextOpen)
    if (nextOpen) {
      reset(getDefaultValues())
      createEquipment.reset()
    }
  }

  function onSubmit(data: CreateEquipmentFormValues) {
    createEquipment.mutate(
      { data },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={storeAddButtonClassName}>
          <Plus aria-hidden="true" />
          Equipment
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-6 rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Add equipment or tools
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Record who&apos;s responsible for it, and assign it to a project or
            keep it in the general store.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {createEquipment.isError && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
            >
              {getErrorMessage(
                createEquipment.error,
                "We couldn't add the equipment. Try again."
              )}
            </p>
          )}

          <EquipmentFormFields
            control={control}
            register={register}
            errors={errors}
            idPrefix="add-equipment"
          />

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createEquipment.isPending}
                className="h-10 rounded-full px-5"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createEquipment.isPending}
              className="h-10 rounded-full px-5"
            >
              {createEquipment.isPending ? "Adding…" : "Add equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
