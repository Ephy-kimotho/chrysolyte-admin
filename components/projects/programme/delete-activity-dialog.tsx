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
import { useDeleteActivity } from "@/hooks/use-delete-activity"
import { getErrorMessage } from "@/lib/api/errors"
import type { ProgrammeActivity } from "@/lib/types/programme"

type DeleteActivityDialogProps = {
  activity: Pick<ProgrammeActivity, "id" | "projectId" | "activity">
}

export function DeleteActivityDialog({ activity }: DeleteActivityDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteActivity = useDeleteActivity()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteActivity.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deleteActivity.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteActivity.mutate({ activity }, { onSuccess: () => setOpen(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${activity.activity}`}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {activity.activity}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            It&apos;ll be removed from the work programme, along with its
            material forecast. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteActivity.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteActivity.error,
              "We couldn't delete this activity. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteActivity.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteActivity.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteActivity.isPending ? "Deleting…" : "Delete activity"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
