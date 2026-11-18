"use client"

import { useRef, useState } from "react"
import {
  EllipsisVertical,
  LockOpen,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react"

import { ConfirmUserActionDialog } from "@/components/users/confirm-user-action-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteUser } from "@/hooks/use-delete-user"
import { useDisableUser } from "@/hooks/use-disable-user"
import { useEnableUser } from "@/hooks/use-enable-user"
import { useUnlockUser } from "@/hooks/use-unlock-user"
import { formatShortDateTime } from "@/lib/format"
import { isClientUser } from "@/lib/types/auth"
import type { User } from "@/lib/types/users"
import { useAuth } from "@/providers/auth-provider"

type OpenDialog = "disable" | "unlock" | "delete" | null

/** The ⋮ menu for a user, with the confirmations its actions need. */
export function UserActions({ user }: { user: User }) {
  const { user: signedInUser } = useAuth()
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const disableUser = useDisableUser()
  const enableUser = useEnableUser()
  const unlockUser = useUnlockUser()
  const deleteUser = useDeleteUser()

  // Disabling or deleting your own account would sign you out for good.
  const isSelf =
    signedInUser !== null &&
    !isClientUser(signedInUser) &&
    signedInUser.user_id === user.id
  const canUnlock = user.isLocked && !!user.lockedUntil

  if (isSelf && !canUnlock) return null

  const options = { userId: user.id, name: user.fullName }
  const closeDialog = () => setOpenDialog(null)

  // The dialogs open from a menu that's gone by the time they close, so
  // send focus back to the ⋮ button instead.
  function focusTrigger(event: Event) {
    event.preventDefault()
    triggerRef.current?.focus()
  }

  // Enabling only restores access, so it runs without asking. The hook's
  // toast reports how it went.
  function enable() {
    enableUser.mutate(options)
  }

  // Each dialog starts without the last attempt's error.
  function open(dialog: Exclude<OpenDialog, null>) {
    disableUser.reset()
    unlockUser.reset()
    deleteUser.reset()
    setOpenDialog(dialog)
  }

  return (
    <>
      {/* Non-modal, so the menu closing doesn't fight the dialog for focus. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon-lg"
            disabled={enableUser.isPending}
            aria-label={`Actions for ${user.fullName}`}
            className="rounded-full text-muted-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          >
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 p-1.5">
          {!isSelf &&
            (user.active ? (
              <DropdownMenuItem
                className="h-9 px-2"
                onSelect={() => open("disable")}
              >
                <UserX aria-hidden="true" />
                Disable user
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="h-9 px-2" onSelect={enable}>
                <UserCheck aria-hidden="true" />
                Enable user
              </DropdownMenuItem>
            ))}
          {canUnlock && (
            <DropdownMenuItem
              className="h-9 px-2"
              onSelect={() => open("unlock")}
            >
              <LockOpen aria-hidden="true" />
              Unlock user
            </DropdownMenuItem>
          )}
          {!isSelf && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="h-9 px-2"
                onSelect={() => open("delete")}
              >
                <Trash2 aria-hidden="true" />
                Delete user
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmUserActionDialog
        open={openDialog === "disable"}
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
        onCloseAutoFocus={focusTrigger}
        title={`Disable ${user.fullName}?`}
        description={`${user.fullName} won't be able to sign in until their account is enabled again. Their account and data are kept.`}
        confirmLabel="Disable user"
        pendingLabel="Disabling…"
        destructive
        isPending={disableUser.isPending}
        error={disableUser.error}
        errorFallback="We couldn't disable this user. Try again."
        onConfirm={() =>
          disableUser.mutate(options, { onSuccess: closeDialog })
        }
      />

      <ConfirmUserActionDialog
        open={openDialog === "unlock"}
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
        onCloseAutoFocus={focusTrigger}
        title={`Unlock ${user.fullName}?`}
        description={
          user.lockedUntil
            ? `Their account is locked until ${formatShortDateTime(user.lockedUntil)} after too many failed sign-in attempts. Unlocking lets them sign in again straight away.`
            : "Unlocking lets them sign in again straight away."
        }
        confirmLabel="Unlock user"
        pendingLabel="Unlocking…"
        isPending={unlockUser.isPending}
        error={unlockUser.error}
        errorFallback="We couldn't unlock this user. Try again."
        onConfirm={() => unlockUser.mutate(options, { onSuccess: closeDialog })}
      />

      <ConfirmUserActionDialog
        open={openDialog === "delete"}
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
        onCloseAutoFocus={focusTrigger}
        title={`Delete ${user.fullName}?`}
        description={`${user.fullName}'s account and all their data will be permanently deleted. You can't undo this. To stop them signing in but keep their data, disable the account instead.`}
        confirmLabel="Delete user"
        pendingLabel="Deleting…"
        destructive
        isPending={deleteUser.isPending}
        error={deleteUser.error}
        errorFallback="We couldn't delete this user. Try again."
        onConfirm={() => deleteUser.mutate(options, { onSuccess: closeDialog })}
      />
    </>
  )
}
