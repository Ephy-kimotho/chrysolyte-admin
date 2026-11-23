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
import { useDeleteStockItem } from "@/hooks/use-delete-stock-item"
import { getErrorMessage } from "@/lib/api/errors"
import type { ProjectStoreItem } from "@/lib/types/stores"

type DeleteStockItemDialogProps = {
  storeItem: Pick<ProjectStoreItem, "id" | "projectId" | "item">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteStockItemDialog({
  storeItem,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteStockItemDialogProps) {
  const deleteStockItem = useDeleteStockItem()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteStockItem.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteStockItem.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteStockItem.mutate(
      { storeItem },
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
            Delete {storeItem.item}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {storeItem.item} will be removed from this project&apos;s store,
            along with its stock count. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteStockItem.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteStockItem.error,
              "We couldn't delete this stock item. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteStockItem.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteStockItem.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteStockItem.isPending ? "Deleting…" : "Delete stock item"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
