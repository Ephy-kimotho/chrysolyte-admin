"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteEquipment } from "@/hooks/use-delete-equipment"
import { getErrorMessage } from "@/lib/api/errors"
import type { Equipment } from "@/lib/types/stores"

type DeleteEquipmentDialogProps = {
  equipment: Pick<Equipment, "id" | "item" | "assetNumber">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteEquipmentDialog({
  equipment,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteEquipmentDialogProps) {
  const deleteEquipment = useDeleteEquipment()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteEquipment.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteEquipment.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteEquipment.mutate(
      { equipment },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {equipment.item}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {equipment.item}
            {equipment.assetNumber && ` (${equipment.assetNumber})`} will be
            removed from the equipment store. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteEquipment.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteEquipment.error,
              "We couldn't delete this equipment. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteEquipment.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteEquipment.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteEquipment.isPending ? "Deleting…" : "Delete equipment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
