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
import { useDeleteWelfareItem } from "@/hooks/use-delete-welfare-item"
import { getErrorMessage } from "@/lib/api/errors"
import type { WelfareItem } from "@/lib/types/stores"

type DeleteWelfareItemDialogProps = {
  welfareItem: Pick<WelfareItem, "id" | "item" | "category">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteWelfareItemDialog({
  welfareItem,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteWelfareItemDialogProps) {
  const deleteWelfareItem = useDeleteWelfareItem()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteWelfareItem.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteWelfareItem.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteWelfareItem.mutate(
      { welfareItem },
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
            Delete {welfareItem.item}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {welfareItem.item} will be removed from the{" "}
            {welfareItem.category.toLowerCase()} store, along with its stock
            count. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteWelfareItem.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteWelfareItem.error,
              "We couldn't delete this welfare item. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteWelfareItem.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteWelfareItem.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteWelfareItem.isPending ? "Deleting…" : "Delete welfare item"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
