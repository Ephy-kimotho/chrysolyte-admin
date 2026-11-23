"use client"

import { useRef, useState } from "react"
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"

import { DeleteWelfareItemDialog } from "@/components/stores/delete-welfare-item-dialog"
import { UpdateWelfareItemDialog } from "@/components/stores/update-welfare-item-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WelfareItem } from "@/lib/types/stores"

type OpenDialog = "update" | "delete" | null

/** The ⋮ menu for a welfare item, with the dialogs its items open. */
export function WelfareItemActions({
  welfareItem,
}: {
  welfareItem: WelfareItem
}) {
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
            aria-label={`Actions for ${welfareItem.item}`}
            className="rounded-full text-muted-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          >
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5">
          <DropdownMenuItem
            className="h-9 px-2"
            onSelect={() => setOpenDialog("update")}
          >
            <Pencil aria-hidden="true" />
            Update welfare item
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="h-9 px-2"
            onSelect={() => setOpenDialog("delete")}
          >
            <Trash2 aria-hidden="true" />
            Delete welfare item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateWelfareItemDialog
        welfareItem={welfareItem}
        open={openDialog === "update"}
        onOpenChange={(open) => setOpenDialog(open ? "update" : null)}
        onCloseAutoFocus={focusTrigger}
      />
      <DeleteWelfareItemDialog
        welfareItem={welfareItem}
        open={openDialog === "delete"}
        onOpenChange={(open) => setOpenDialog(open ? "delete" : null)}
        onCloseAutoFocus={focusTrigger}
      />
    </>
  )
}
