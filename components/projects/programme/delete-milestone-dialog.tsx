"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteMilestone } from "@/hooks/use-delete-milestone"
import { getErrorMessage } from "@/lib/api/errors"
import type { Milestone } from "@/lib/types/programme"

type DeleteMilestoneDialogProps = {
  milestone: Pick<Milestone, "id" | "projectId" | "name" | "weight">
}

export function DeleteMilestoneDialog({
  milestone,
}: DeleteMilestoneDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteMilestone = useDeleteMilestone()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteMilestone.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deleteMilestone.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteMilestone.mutate({ milestone }, { onSuccess: () => setOpen(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${milestone.name}`}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {milestone.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Its {milestone.weight}% weight is freed for other milestones, and
            the project&apos;s progress is recalculated without it. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMilestone.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteMilestone.error,
              "We couldn't delete this milestone. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteMilestone.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMilestone.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteMilestone.isPending ? "Deleting…" : "Delete milestone"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
