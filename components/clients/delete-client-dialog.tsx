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
import { useDeleteClient } from "@/hooks/use-delete-client"
import { getErrorMessage } from "@/lib/api/errors"
import type { Client } from "@/lib/types/clients"

type DeleteClientDialogProps = {
  client: Pick<Client, "id" | "name">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
}

export function DeleteClientDialog({
  client,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteClientDialogProps) {
  const deleteClient = useDeleteClient()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteClient.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteClient.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteClient.mutate(
      { id: client.id },
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
            Delete {client.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            The client and their contact details will be deleted. You can&apos;t
            undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteClient.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteClient.error,
              "We couldn't delete this client. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteClient.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteClient.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteClient.isPending ? "Deleting…" : "Delete client"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
