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
import { useDeleteProjectPhoto } from "@/hooks/use-delete-project-photo"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

type DeleteProjectPhotoDialogProps = {
  projectId: string
  projectName: string
  /** Positions the trash button, e.g. over the photo's corner. */
  className?: string
}

export function DeleteProjectPhotoDialog({
  projectId,
  projectName,
  className,
}: DeleteProjectPhotoDialogProps) {
  const [open, setOpen] = useState(false)
  const deletePhoto = useDeleteProjectPhoto()

  function handleOpenChange(nextOpen: boolean) {
    if (deletePhoto.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deletePhoto.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deletePhoto.mutate(
      { projectId, name: projectName },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={`Delete ${projectName}'s photo`}
          className={cn(
            "rounded-xl border-0 bg-black/45 text-white backdrop-blur-sm hover:bg-destructive hover:text-white aria-expanded:bg-destructive aria-expanded:text-white",
            className
          )}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {projectName}&apos;s photo?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Its division placeholder will show in its place. You can upload a
            new photo at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deletePhoto.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deletePhoto.error,
              "We couldn't delete the photo. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deletePhoto.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deletePhoto.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deletePhoto.isPending ? "Deleting…" : "Delete photo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
