"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { EllipsisVertical, Eye, FolderPlus, Pencil, Trash2 } from "lucide-react"

import { AssignProjectDialog } from "@/components/staff/assign-project-dialog"
import { DeleteStaffDialog } from "@/components/staff/delete-staff-dialog"
import { UpdateStaffDialog } from "@/components/staff/update-staff-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StaffMember } from "@/lib/types/staff"

type OpenDialog = "update" | "assign" | "delete" | null

type StaffActionsProps = {
  member: StaffMember
  /** Adds a link to their profile; for lists, not the profile page itself. */
  showViewDetails?: boolean
  /** Runs after the staff member is deleted, e.g. to leave their profile. */
  onDeleted?: () => void
}

/** The ⋮ menu for a staff member, with the dialogs its items open. */
export function StaffActions({
  member,
  showViewDetails = false,
  onDeleted,
}: StaffActionsProps) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // The dialogs open from a menu that's gone by the time they close, so
  // send focus back to the ⋮ button instead.
  function focusTrigger(event: Event) {
    event.preventDefault()
    triggerRef.current?.focus()
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
            aria-label={`Actions for ${member.fullName}`}
            className="rounded-full text-muted-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          >
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5">
          {showViewDetails && (
            <DropdownMenuItem asChild className="h-9 px-2">
              <Link href={`/staff-kpi/${member.id}`}>
                <Eye aria-hidden="true" />
                View details
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="h-9 px-2"
            onSelect={() => setOpenDialog("update")}
          >
            <Pencil aria-hidden="true" />
            Update staff
          </DropdownMenuItem>
          <DropdownMenuItem
            className="h-9 px-2"
            onSelect={() => setOpenDialog("assign")}
          >
            <FolderPlus aria-hidden="true" />
            Assign project
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="h-9 px-2"
            onSelect={() => setOpenDialog("delete")}
          >
            <Trash2 aria-hidden="true" />
            Delete staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateStaffDialog
        member={member}
        open={openDialog === "update"}
        onOpenChange={(open) => setOpenDialog(open ? "update" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      <AssignProjectDialog
        member={member}
        open={openDialog === "assign"}
        onOpenChange={(open) => setOpenDialog(open ? "assign" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      <DeleteStaffDialog
        member={member}
        open={openDialog === "delete"}
        onOpenChange={(open) => setOpenDialog(open ? "delete" : null)}
        onCloseAutoFocus={focusTrigger}
        onDeleted={onDeleted}
      />
    </>
  )
}
