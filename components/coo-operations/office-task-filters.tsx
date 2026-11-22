"use client"

import { X } from "lucide-react"

import { ProjectCombobox } from "@/components/projects/project-combobox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  officeTaskCategories,
  officeTaskStatuses,
  type OfficeTaskFilters as Filters,
} from "@/lib/types/coo-operations"

// Select items can't have an empty value, so "any" stands in for no filter.
const anyValue = "any"

const selectTriggerClassName = "h-11! w-full rounded-xl bg-background/60 px-3.5"

type OfficeTaskFiltersProps = {
  filters: Filters
  onChange: (filters: Filters) => void
}

/** Narrows the office work log by project, status and category. */
export function OfficeTaskFilters({
  filters,
  onChange,
}: OfficeTaskFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean)

  function update(key: keyof Filters, value: string | undefined) {
    onChange({ ...filters, [key]: value || undefined })
  }

  return (
    <div
      role="group"
      aria-label="Filter office tasks"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,18rem)_minmax(0,12rem)_minmax(0,14rem)_auto]"
    >
      <div>
        <label htmlFor="office-task-filter-project" className="sr-only">
          Project
        </label>
        <ProjectCombobox
          id="office-task-filter-project"
          value={filters.projectId ?? ""}
          onChange={(option) => update("projectId", option?.value)}
          placeholder="All projects"
          clearable
        />
      </div>

      <Select
        value={filters.status ?? anyValue}
        onValueChange={(value) =>
          update("status", value === anyValue ? undefined : value)
        }
      >
        <SelectTrigger aria-label="Status" className={selectTriggerClassName}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value={anyValue}>All statuses</SelectItem>
          {officeTaskStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category ?? anyValue}
        onValueChange={(value) =>
          update("category", value === anyValue ? undefined : value)
        }
      >
        <SelectTrigger aria-label="Category" className={selectTriggerClassName}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value={anyValue}>All categories</SelectItem>
          {officeTaskCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange({})}
          className="h-11 justify-self-start rounded-xl px-3.5 text-muted-foreground"
        >
          <X aria-hidden="true" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
