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
import { useRemoveStaffMember } from "@/hooks/use-remove-staff-member"
import type { StaffMember } from "@/lib/types/staff"

type RemoveStaffDialogProps = {
  member: Pick<StaffMember, "id" | "fullName">
  /** "icon" for tables and cards, "button" for a labelled button. */
  trigger?: "icon" | "button"
  /** Runs after the staff member is removed, e.g. to leave their profile. */
  onRemoved?: () => void
}

export function RemoveStaffDialog({
  member,
  trigger = "icon",
  onRemoved,
}: RemoveStaffDialogProps) {
  const [open, setOpen] = useState(false)
  const removeStaffMember = useRemoveStaffMember()

  function handleOpenChange(nextOpen: boolean) {
    if (removeStaffMember.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) removeStaffMember.reset()
  }

  function handleRemove(event: React.MouseEvent) {
    // Stay open until the removal finishes, so a failure can be shown here.
    event.preventDefault()
    removeStaffMember.mutate(
      { id: member.id },
      {
        onSuccess: () => {
          setOpen(false)
          onRemoved?.()
        },
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger === "icon" ? (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={`Remove ${member.fullName}`}
            className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="h-10 rounded-full px-4 font-semibold"
          >
            <Trash2 aria-hidden="true" />
            Remove
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Remove {member.fullName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            Their profile, assignment and KPI history will be removed. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {removeStaffMember.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            We couldn&apos;t remove this staff member. Try again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={removeStaffMember.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={removeStaffMember.isPending}
            onClick={handleRemove}
            className="h-10 rounded-full px-5"
          >
            {removeStaffMember.isPending ? "Removing…" : "Remove staff member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
