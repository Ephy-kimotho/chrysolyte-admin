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
import { useCloseProjectInstruction } from "@/hooks/use-close-project-instruction"
import { getErrorMessage } from "@/lib/api/errors"
import type { ProjectInstruction } from "@/lib/types/projects"

type CloseProjectInstructionDialogProps = {
  instruction: Pick<ProjectInstruction, "id" | "projectId" | "discipline">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function CloseProjectInstructionDialog({
  instruction,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: CloseProjectInstructionDialogProps) {
  const closeInstruction = useCloseProjectInstruction()

  function handleOpenChange(nextOpen: boolean) {
    if (closeInstruction.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) closeInstruction.reset()
  }

  function handleClose(event: React.MouseEvent) {
    // Stay open until the request finishes, so a failure can be shown here.
    event.preventDefault()
    closeInstruction.mutate(
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
            Close this instruction?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Closing marks it as carried out, and it stops being tracked as open.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {closeInstruction.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              closeInstruction.error,
              "We couldn't close this instruction. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={closeInstruction.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={closeInstruction.isPending}
            onClick={handleClose}
            className="h-10 rounded-full px-5"
          >
            {closeInstruction.isPending ? "Closing…" : "Close instruction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
