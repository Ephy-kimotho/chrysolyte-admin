"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import { photoActionClassName } from "@/components/staff/upload-staff-photo-dialog"
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
import { useDeleteStaffPhoto } from "@/hooks/use-delete-staff-photo"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

type DeleteStaffPhotoDialogProps = {
  staffId: string
  staffName: string
}

export function DeleteStaffPhotoDialog({
  staffId,
  staffName,
}: DeleteStaffPhotoDialogProps) {
  const [open, setOpen] = useState(false)
  const deletePhoto = useDeleteStaffPhoto()

  function handleOpenChange(nextOpen: boolean) {
    if (deletePhoto.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deletePhoto.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deletePhoto.mutate(
      { staffId, name: staffName },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Delete ${staffName}'s photo`}
          className={cn(
            photoActionClassName,
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
          )}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {staffName}&apos;s photo?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Their initials will show in its place. You can upload a new photo at
            any time.
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
