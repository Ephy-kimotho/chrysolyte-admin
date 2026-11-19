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
import { useDeleteStaffMember } from "@/hooks/use-delete-staff-member"
import { getErrorMessage } from "@/lib/api/errors"
import type { StaffMember } from "@/lib/types/staff"

type DeleteStaffDialogProps = {
  member: Pick<StaffMember, "id" | "fullName">
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
  /** Runs after the staff member is deleted, e.g. to leave their profile. */
  onDeleted?: () => void
}

export function DeleteStaffDialog({
  member,
  open,
  onOpenChange,
  onCloseAutoFocus,
  onDeleted,
}: DeleteStaffDialogProps) {
  const deleteStaffMember = useDeleteStaffMember()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteStaffMember.isPending) return
    onOpenChange(nextOpen)
    if (!nextOpen) deleteStaffMember.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteStaffMember.mutate(
      { staffId: member.id, name: member.fullName },
      {
        onSuccess: () => {
          onOpenChange(false)
          onDeleted?.()
        },
      }
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
            Delete {member.fullName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Their profile, skills and emergency contacts will be deleted. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteStaffMember.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteStaffMember.error,
              "We couldn't delete this staff member. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteStaffMember.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteStaffMember.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteStaffMember.isPending ? "Deleting…" : "Delete staff member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
