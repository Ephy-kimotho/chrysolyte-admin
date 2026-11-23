"use client"

import { authInputClassName } from "@/components/auth/styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type UnitInputProps = {
  id: string
  name?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  /** Common units shown as one-tap choices. Any other unit can be typed. */
  suggestions: readonly string[]
  "aria-invalid"?: boolean
  ref?: React.Ref<HTMLInputElement>
}

/** A free-text unit field with one-tap suggestions below it. */
export function UnitInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  suggestions,
  "aria-invalid": ariaInvalid,
  ref,
}: UnitInputProps) {
  const suggestionsId = `${id}-suggestions`

  return (
    <>
      <Input
        id={id}
        ref={ref}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        autoComplete="off"
        placeholder="Pick one below or type your own"
        aria-invalid={ariaInvalid}
        aria-describedby={suggestionsId}
        className={authInputClassName}
      />
      <div
        id={suggestionsId}
        role="group"
        aria-label="Common units"
        className="flex flex-wrap gap-1.5"
      >
        {suggestions.map((unit) => {
          const chosen = value.trim() === unit
          return (
            <Button
              key={unit}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={chosen}
              onClick={() => onChange(unit)}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium",
                chosen &&
                  "border-primary bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
              )}
            >
              {unit}
            </Button>
          )
        })}
      </div>
    </>
  )
}
