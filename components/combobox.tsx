"use client"

import { useState } from "react"
import { ChevronsUpDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  value: string
  label: string
  /** Secondary line, e.g. a role or contact name. Also searchable. */
  description?: string
}

type ComboboxProps = {
  id?: string
  name?: string
  /** The chosen option's value, or "" when nothing is chosen. */
  value: string
  /** Called with the chosen option, or null when the choice is cleared. */
  onChange: (option: ComboboxOption | null) => void
  onBlur?: () => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  /** Shown when no option matches, or while the options load. */
  emptyMessage?: React.ReactNode
  /**
   * Trigger text for a chosen value that isn't in `options`, e.g. when a
   * server search has filtered it out.
   */
  selectedLabel?: string
  /**
   * Controls the search text for filtering on the server. When it's given,
   * the options are shown as passed instead of being filtered here.
   */
  search?: string
  onSearchChange?: (search: string) => void
  /** Offers a way to clear the choice, for optional fields. */
  clearable?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}

/** Matches the search against an option's label and description only. */
function filterByKeywords(_value: string, search: string, keywords?: string[]) {
  const term = search.trim().toLowerCase()
  if (!term) return 1
  return keywords?.join(" ").toLowerCase().includes(term) ? 1 : 0
}

/**
 * A searchable select built from shadcn's Command in a Popover. It drops into
 * React Hook Form via `Controller`, like `DatePicker`.
 */
export function Combobox({
  id,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Choose an option",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  selectedLabel,
  search,
  onSearchChange,
  clearable,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
  ref,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const filtersOnServer = search !== undefined
  const selected = options.find((option) => option.value === value)
  const label = value ? (selected?.label ?? selectedLabel) : undefined

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      // Each opening starts with a fresh search.
      onSearchChange?.("")
      // Mark the field touched when the list closes, like a native blur.
      onBlur?.()
    }
  }

  function choose(option: ComboboxOption | null) {
    onChange(option)
    handleOpenChange(false)
  }

  return (
    // Modal so the list scrolls with the wheel and touch inside a Dialog.
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          id={id}
          name={name}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "h-11 w-full justify-between rounded-xl bg-background/60 px-3.5 font-normal hover:bg-background/60 aria-expanded:bg-background/60",
            !label && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{label ?? placeholder}</span>
          <ChevronsUpDown
            aria-hidden="true"
            className="text-muted-foreground"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 rounded-xl p-0"
      >
        <Command
          shouldFilter={!filtersOnServer}
          filter={filterByKeywords}
          className="rounded-xl!"
        >
          <CommandInput
            placeholder={searchPlaceholder}
            {...(filtersOnServer && {
              value: search,
              onValueChange: onSearchChange,
            })}
          />
          <CommandList>
            <CommandEmpty className="px-3 py-6 text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  // The value is an ID, so cmdk searches the keywords instead.
                  value={option.value}
                  keywords={[option.label, option.description ?? ""]}
                  data-checked={option.value === value}
                  onSelect={() => choose(option)}
                  className="py-2"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{option.label}</span>
                    {option.description && (
                      <span className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {clearable && value && (
            <div className="border-t p-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => choose(null)}
                className="w-full justify-start text-muted-foreground"
              >
                <X aria-hidden="true" />
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
