"use client"

import { Combobox, type ComboboxOption } from "@/components/combobox"
import { useStaff } from "@/hooks/use-staff"

type StaffComboboxProps = Omit<
  React.ComponentProps<typeof Combobox>,
  "options" | "search" | "onSearchChange" | "emptyMessage"
>

/** Picks an active staff member, searching them by name or role. */
export function StaffCombobox(props: StaffComboboxProps) {
  // Every staff picker shares this one cached list.
  const staff = useStaff({ activeOnly: true })

  const options: ComboboxOption[] = (staff.data ?? []).map((member) => ({
    value: member.id,
    label: member.fullName,
    description: member.role,
  }))

  let emptyMessage = "No staff match that name."
  if (staff.isPending) emptyMessage = "Loading staff…"
  else if (staff.isError) emptyMessage = "Couldn't load staff. Try again."
  else if (options.length === 0) emptyMessage = "No active staff yet."

  return (
    <Combobox
      placeholder="Choose a staff member"
      searchPlaceholder="Search staff by name"
      {...props}
      options={options}
      emptyMessage={emptyMessage}
    />
  )
}
