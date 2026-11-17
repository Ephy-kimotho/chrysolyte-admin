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
import { getErrorMessage } from "@/lib/api/errors"

type ConfirmUserActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where focus goes when the dialog closes, since it has no trigger. */
  onCloseAutoFocus?: (event: Event) => void
  title: string
  /** What happens to the user, so the consequence is clear before confirming. */
  description: React.ReactNode
  confirmLabel: string
  pendingLabel: string
  destructive?: boolean
  /** The action's mutation state, owned by the caller. */
  isPending: boolean
  error: Error | null
  errorFallback: string
  onConfirm: () => void
}

/** Asks before a user action runs, and shows a failure without closing. */
export function ConfirmUserActionDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
  title,
  description,
  confirmLabel,
  pendingLabel,
  destructive = false,
  isPending,
  error,
  errorFallback,
  onConfirm,
}: ConfirmUserActionDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return
    onOpenChange(nextOpen)
  }

  function handleConfirm(event: React.MouseEvent) {
    // Stay open until the action finishes, so a failure can be shown here.
    event.preventDefault()
    onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-heading">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-destructive-muted px-3.5 py-2.5 text-sm text-destructive"
          >
            {getErrorMessage(error, errorFallback)}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="h-10 rounded-full px-5"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={isPending}
            onClick={handleConfirm}
            className="h-10 rounded-full px-5"
          >
            {isPending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
