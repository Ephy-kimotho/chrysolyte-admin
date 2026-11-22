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
import { useDeleteOfficeTask } from "@/hooks/use-delete-office-task"
import { getErrorMessage } from "@/lib/api/errors"
import type { OfficeTask } from "@/lib/types/coo-operations"

type DeleteOfficeTaskDialogProps = {
  task: Pick<OfficeTask, "id" | "task">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteOfficeTaskDialog({
  task,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteOfficeTaskDialogProps) {
  const deleteOfficeTask = useDeleteOfficeTask()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteOfficeTask.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteOfficeTask.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteOfficeTask.mutate({ task }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {task.task} will be removed from the office work log. You can&apos;t
            undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteOfficeTask.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteOfficeTask.error,
              "We couldn't delete this task. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteOfficeTask.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteOfficeTask.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteOfficeTask.isPending ? "Deleting…" : "Delete task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
