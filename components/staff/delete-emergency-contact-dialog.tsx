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
import { useDeleteEmergencyContact } from "@/hooks/use-delete-emergency-contact"
import { getErrorMessage } from "@/lib/api/errors"
import type { EmergencyContact } from "@/lib/types/staff"

type DeleteEmergencyContactDialogProps = {
  contact: Pick<EmergencyContact, "id" | "name">
  /** The staff member whose contact this is. */
  staffId: string
  staffName: string
}

export function DeleteEmergencyContactDialog({
  contact,
  staffId,
  staffName,
}: DeleteEmergencyContactDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteContact = useDeleteEmergencyContact()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteContact.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deleteContact.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteContact.mutate(
      { id: contact.id, staffId, name: contact.name },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Delete ${contact.name}`}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {contact.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            They&apos;ll no longer be listed as an emergency contact for{" "}
            {staffName}. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteContact.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteContact.error,
              "We couldn't delete this emergency contact. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteContact.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteContact.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteContact.isPending ? "Deleting…" : "Delete contact"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
