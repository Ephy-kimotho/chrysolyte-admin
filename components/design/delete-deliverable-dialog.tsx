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
import { useDeleteDesignDeliverable } from "@/hooks/use-delete-design-deliverable"
import { getErrorMessage } from "@/lib/api/errors"
import type { DesignDeliverable } from "@/lib/types/design"

type DeleteDeliverableDialogProps = {
  deliverable: Pick<DesignDeliverable, "id" | "projectId" | "deliverable">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteDeliverableDialog({
  deliverable,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteDeliverableDialogProps) {
  const deleteDeliverable = useDeleteDesignDeliverable()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteDeliverable.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteDeliverable.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteDeliverable.mutate(
      { deliverable },
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
            Delete this deliverable?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {deliverable.deliverable} will no longer be tracked in the design
            portal. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteDeliverable.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteDeliverable.error,
              "We couldn't delete this deliverable. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteDeliverable.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteDeliverable.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteDeliverable.isPending ? "Deleting…" : "Delete deliverable"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
