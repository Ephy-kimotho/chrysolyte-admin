"use client"

import { useRef, useState } from "react"
// Pencil goes back in with the update action.
import { CircleCheck, EllipsisVertical, Trash2 } from "lucide-react"

import { CloseProjectInstructionDialog } from "@/components/projects/close-project-instruction-dialog"
import { DeleteProjectInstructionDialog } from "@/components/projects/delete-project-instruction-dialog"
// import { UpdateProjectInstructionDialog } from "@/components/projects/update-project-instruction-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProjectInstruction } from "@/lib/types/projects"

type OpenDialog = "update" | "close" | "delete" | null

/** The ⋮ menu for a project instruction, with the dialogs its items open. */
export function ProjectInstructionActions({
  instruction,
}: {
  instruction: ProjectInstruction
}) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  // Only an open instruction can be closed.
  const isOpen = instruction.status.toLowerCase() === "open"

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
            aria-label="Instruction actions"
            className="rounded-full text-muted-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          >
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5">
          {/* Hidden until the update API is ready.
          <DropdownMenuItem
            className="h-9 px-2"
            onSelect={() => setOpenDialog("update")}
          >
            <Pencil aria-hidden="true" />
            Update instruction
          </DropdownMenuItem>
          */}
          {isOpen && (
            <DropdownMenuItem
              className="h-9 px-2"
              onSelect={() => setOpenDialog("close")}
            >
              <CircleCheck aria-hidden="true" />
              Close instruction
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            className="h-9 px-2"
            onSelect={() => setOpenDialog("delete")}
          >
            <Trash2 aria-hidden="true" />
            Delete instruction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden until the update API is ready.
      <UpdateProjectInstructionDialog
        instruction={instruction}
        open={openDialog === "update"}
        onOpenChange={(open) => setOpenDialog(open ? "update" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      */}
      <CloseProjectInstructionDialog
        instruction={instruction}
        open={openDialog === "close"}
        onOpenChange={(open) => setOpenDialog(open ? "close" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      <DeleteProjectInstructionDialog
        instruction={instruction}
        open={openDialog === "delete"}
        onOpenChange={(open) => setOpenDialog(open ? "delete" : null)}
        onCloseAutoFocus={focusTrigger}
      />
    </>
  )
}
