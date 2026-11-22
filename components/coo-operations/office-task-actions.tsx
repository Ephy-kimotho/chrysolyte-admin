"use client"

import { useRef, useState } from "react"
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"

import { DeleteOfficeTaskDialog } from "@/components/coo-operations/delete-office-task-dialog"
import { UpdateOfficeTaskDialog } from "@/components/coo-operations/update-office-task-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { OfficeTask } from "@/lib/types/coo-operations"

type OpenDialog = "update" | "delete" | null

/** The ⋮ menu for an office task, with the dialogs its items open. */
export function OfficeTaskActions({ task }: { task: OfficeTask }) {
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
            aria-label={`Actions for ${task.task}`}
            className="rounded-full text-muted-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          >
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 p-1.5">
          <DropdownMenuItem
            className="h-9 px-2"
            onSelect={() => setOpenDialog("update")}
          >
            <Pencil aria-hidden="true" />
            Update task
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="h-9 px-2"
            onSelect={() => setOpenDialog("delete")}
          >
            <Trash2 aria-hidden="true" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateOfficeTaskDialog
        task={task}
        open={openDialog === "update"}
        onOpenChange={(open) => setOpenDialog(open ? "update" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      <DeleteOfficeTaskDialog
        task={task}
        open={openDialog === "delete"}
        onOpenChange={(open) => setOpenDialog(open ? "delete" : null)}
        onCloseAutoFocus={focusTrigger}
      />
    </>
  )
}
