"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { EquipmentFormFields } from "@/components/stores/equipment-form-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUpdateEquipment } from "@/hooks/use-update-equipment"
import { getErrorMessage } from "@/lib/api/errors"
import { createEquipmentSchema } from "@/lib/schemas/stores"
import {
  isEquipmentCategory,
  isEquipmentCondition,
  type CreateEquipmentFormValues,
  type Equipment,
} from "@/lib/types/stores"

type UpdateEquipmentDialogProps = {
  equipment: Equipment
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function UpdateEquipmentDialog({
  equipment,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: UpdateEquipmentDialogProps) {
  const updateEquipment = useUpdateEquipment()

  function handleOpenChange(nextOpen: boolean) {
    if (updateEquipment.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) updateEquipment.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 rounded-2xl p-5 sm:p-6"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-bold text-heading">
            Update equipment
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Change the details on record for {equipment.item}, e.g. when it
            moves to another project or its condition changes.
          </DialogDescription>
        </DialogHeader>

        {/* The form mounts on every opening, so it starts from the item's current details. */}
        <UpdateEquipmentForm
          equipment={equipment}
          updateEquipment={updateEquipment}
          onUpdated={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function UpdateEquipmentForm({
  equipment,
  updateEquipment,
  onUpdated,
}: {
  equipment: Equipment
  updateEquipment: ReturnType<typeof useUpdateEquipment>
  onUpdated: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEquipmentFormValues>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues: {
      assetNumber: equipment.assetNumber ?? "",
      item: equipment.item,
      // An unknown category or condition is left blank, so a valid one has
      // to be chosen.
      category: isEquipmentCategory(equipment.category)
        ? equipment.category
        : undefined,
      condition: isEquipmentCondition(equipment.condition)
        ? equipment.condition
        : undefined,
      qty: equipment.quantity,
      purchaseCost: equipment.purchaseCost,
      assignedProjectId: equipment.assignedProjectId ?? "",
      responsibleId: equipment.responsibleId ?? "",
      issuedDate: equipment.issuedDate ?? "",
      returnDate: equipment.returnDate ?? "",
      maintenanceNotes: equipment.maintenanceNotes ?? "",
    },
  })

  function onSubmit(data: CreateEquipmentFormValues) {
    updateEquipment.mutate({ equipment, data }, { onSuccess: onUpdated })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateEquipment.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
        >
          {getErrorMessage(
            updateEquipment.error,
            "We couldn't save the changes. Try again."
          )}
        </p>
      )}

      <EquipmentFormFields
        control={control}
        register={register}
        errors={errors}
        idPrefix={`update-equipment-${equipment.id}`}
      />

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={updateEquipment.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={updateEquipment.isPending}
          className="h-10 rounded-full px-5"
        >
          {updateEquipment.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
