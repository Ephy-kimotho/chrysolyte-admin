"use client"

import { Combobox, type ComboboxOption } from "@/components/combobox"
import { useProjects } from "@/hooks/use-projects"

type ProjectComboboxProps = Omit<
  React.ComponentProps<typeof Combobox>,
  "options" | "search" | "onSearchChange" | "emptyMessage"
>

/** Picks a project, searching them by name or project ID. */
export function ProjectCombobox(props: ProjectComboboxProps) {
  const projects = useProjects()

  // The code is the description, so the search matches it as well as the name.
  const options: ComboboxOption[] = (projects.data ?? []).map((project) => ({
    value: project.id,
    label: project.name,
    description: project.code,
  }))

  let emptyMessage = "No projects match that name or ID."
  if (projects.isPending) emptyMessage = "Loading projects…"
  else if (projects.isError) emptyMessage = "Couldn't load projects. Try again."
  else if (options.length === 0) emptyMessage = "No projects yet."

  return (
    <Combobox
      placeholder="Choose a project"
      searchPlaceholder="Search by name or project ID"
      {...props}
      options={options}
      emptyMessage={emptyMessage}
    />
  )
}
