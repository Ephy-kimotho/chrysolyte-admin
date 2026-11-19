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
import { useDeleteStaffSkill } from "@/hooks/use-delete-staff-skill"
import { getErrorMessage } from "@/lib/api/errors"
import type { StaffSkill } from "@/lib/types/staff"

type DeleteStaffSkillDialogProps = {
  skill: Pick<StaffSkill, "id" | "skill">
  /** The staff member whose skill this is. */
  staffId: string
  staffName: string
}

export function DeleteStaffSkillDialog({
  skill,
  staffId,
  staffName,
}: DeleteStaffSkillDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteSkill = useDeleteStaffSkill()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteSkill.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) deleteSkill.reset()
  }

  function handleDelete(event: React.MouseEvent) {
    // Stay open until the delete finishes, so a failure can be shown here.
    event.preventDefault()
    deleteSkill.mutate(
      { id: skill.id, staffId, name: skill.skill },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Delete ${skill.skill}`}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Delete {skill.skill}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            It&apos;ll be removed from {staffName}&apos;s credentials and
            competences. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteSkill.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(
              deleteSkill.error,
              "We couldn't delete this skill. Try again."
            )}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteSkill.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteSkill.isPending}
            onClick={handleDelete}
            className="h-10 rounded-full px-5"
          >
            {deleteSkill.isPending ? "Deleting…" : "Delete skill"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
