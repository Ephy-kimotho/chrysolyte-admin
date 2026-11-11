"use client"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  id?: string
  name?: string
  /** ISO date (yyyy-MM-dd), or "" / undefined when nothing is chosen. */
  value: string | undefined
  /** Called with the chosen date as an ISO date (yyyy-MM-dd). */
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  "aria-invalid"?: boolean
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}

/**
 * A date field built from shadcn's Calendar in a Popover. It reads and writes
 * ISO date strings, so it drops into React Hook Form via `Controller` with the
 * same schemas a native date input used.
 */
export function DatePicker({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Pick a date",
  disabled,
  "aria-invalid": ariaInvalid,
  className,
  ref,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const parsed = value ? parseISO(value) : undefined
  const selected = parsed && isValid(parsed) ? parsed : undefined

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    // Mark the field touched when the picker closes, like a native input blur.
    if (!nextOpen) onBlur?.()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          id={id}
          name={name}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "h-11 w-full justify-between rounded-xl bg-background/60 px-3.5 font-normal hover:bg-background/60 aria-expanded:bg-background/60",
            !selected && "text-muted-foreground",
            className
          )}
        >
          {selected ? formatDate(value!) : placeholder}
          <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-xl p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (date) onChange(format(date, "yyyy-MM-dd"))
            handleOpenChange(false)
          }}
          autoFocus
          // Larger day cells so they're easy to tap on touch screens.
          className="[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  )
}
