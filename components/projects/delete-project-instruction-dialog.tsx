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
import { useDeleteProjectInstruction } from "@/hooks/use-delete-project-instruction"
import { getErrorMessage } from "@/lib/api/errors"
import type { ProjectInstruction } from "@/lib/types/projects"

type DeleteProjectInstructionDialogProps = {
  instruction: Pick<ProjectInstruction, "id" | "projectId" | "discipline">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteProjectInstructionDialog({
  instruction,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteProjectInstructionDialogProps) {
  const deleteInstruction = useDeleteProjectInstruction()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteInstruction.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteInstruction.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteInstruction.mutate(
      { instruction },
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
            Delete this instruction?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            It will be removed from the project&apos;s instructions. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteInstruction.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteInstruction.error,
              "We couldn't delete this instruction. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteInstruction.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteInstruction.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteInstruction.isPending ? "Deleting…" : "Delete instruction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
