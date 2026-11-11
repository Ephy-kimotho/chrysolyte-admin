"use client"

import { useState } from "react"

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
import { useRemoveProject } from "@/hooks/use-remove-project"
import type { Project } from "@/lib/types/projects"

type RemoveProjectDialogProps = {
  project: Pick<Project, "id" | "name">
}

export function RemoveProjectDialog({ project }: RemoveProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const removeProject = useRemoveProject()

  function handleOpenChange(nextOpen: boolean) {
    if (removeProject.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) removeProject.reset()
  }

  function handleRemove(event: React.MouseEvent) {
    // Stay open until the removal finishes, so a failure can be shown here.
    event.preventDefault()
    removeProject.mutate(
      { id: project.id },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="h-9 rounded-full px-4 font-semibold"
        >
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Remove {project.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            The project and its progress will be removed from the portfolio. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {removeProject.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            We couldn&apos;t remove the project. Try again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={removeProject.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={removeProject.isPending}
            onClick={handleRemove}
            className="h-10 rounded-full px-5"
          >
            {removeProject.isPending ? "Removing…" : "Remove project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
