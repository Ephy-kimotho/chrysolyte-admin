"use client"

import { useState } from "react"

import { Combobox, type ComboboxOption } from "@/components/combobox"
import { useClients } from "@/hooks/use-clients"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

type ClientComboboxProps = Omit<
  React.ComponentProps<typeof Combobox>,
  "options" | "search" | "onSearchChange" | "emptyMessage"
>

/** Picks a client, searching them by name on the server. */
export function ClientCombobox(props: ClientComboboxProps) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search)
  const clients = useClients({ search: debouncedSearch })

  const options: ComboboxOption[] = (clients.data ?? []).map((client) => ({
    value: client.id,
    label: client.name,
    description: client.contactName,
  }))

  let emptyMessage = "No clients match that name."
  if (clients.isPending) emptyMessage = "Loading clients…"
  else if (clients.isError) emptyMessage = "Couldn't load clients. Try again."
  else if (!debouncedSearch.trim()) emptyMessage = "No clients yet."

  return (
    <Combobox
      placeholder="Choose a client"
      searchPlaceholder="Search clients by name"
      {...props}
      options={options}
      search={search}
      onSearchChange={setSearch}
      emptyMessage={emptyMessage}
    />
  )
}
