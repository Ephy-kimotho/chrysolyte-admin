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
import { useRemoveAnnouncement } from "@/hooks/use-remove-announcement"
import type { Announcement } from "@/lib/types/announcements"

type RemoveAnnouncementDialogProps = {
  announcement: Pick<Announcement, "id" | "title">
}

export function RemoveAnnouncementDialog({
  announcement,
}: RemoveAnnouncementDialogProps) {
  const [open, setOpen] = useState(false)
  const removeAnnouncement = useRemoveAnnouncement()

  function handleOpenChange(nextOpen: boolean) {
    if (removeAnnouncement.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) removeAnnouncement.reset()
  }

  function handleRemove(event: React.MouseEvent) {
    // Stay open until the removal finishes, so a failure can be shown here.
    event.preventDefault()
    removeAnnouncement.mutate(
      { id: announcement.id },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Remove announcement: ${announcement.title}`}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive aria-expanded:bg-destructive/10 aria-expanded:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            Remove this announcement?
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            &ldquo;{announcement.title}&rdquo; will be removed for everyone. You
            can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {removeAnnouncement.isError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            We couldn&apos;t remove the announcement. Try again.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={removeAnnouncement.isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={removeAnnouncement.isPending}
            onClick={handleRemove}
            className="h-10 rounded-full px-5"
          >
            {removeAnnouncement.isPending ? "Removing…" : "Remove announcement"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
