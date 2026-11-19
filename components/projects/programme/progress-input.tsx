"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { progressUpdateSchema } from "@/lib/schemas/programme"
import type { ProgressUpdateFormValues } from "@/lib/types/programme"

type ProgressInputProps = {
  /** Unique per row, for linking the error message. */
  id: string
  /** What's being updated, e.g. the milestone's name, for the label. */
  name: string
  /** The saved progress, 0–100. */
  value: number
  /** Saves a changed value; call `onError` if the save fails. */
  onSave: (data: ProgressUpdateFormValues, onError: () => void) => void
  isSaving: boolean
}

/** Inline progress field for a table row. It saves on blur or Enter. */
export function ProgressInput({
  id,
  name,
  value,
  onSave,
  isSaving,
}: ProgressInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgressUpdateFormValues>({
    resolver: zodResolver(progressUpdateSchema),
    // Follows the saved value, e.g. after another update.
    values: { progress: value },
  })
  const errorId = `progress-error-${id}`

  function onSubmit(data: ProgressUpdateFormValues) {
    if (data.progress === value) return
    // Shows the saved value again; the toast says what went wrong.
    onSave(data, () => reset({ progress: value }))
  }

  const save = handleSubmit(onSubmit)

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-1">
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        step={1}
        aria-label={`${name} progress (%)`}
        // Read-only rather than disabled, so saving with Enter keeps focus here.
        readOnly={isSaving}
        aria-busy={isSaving}
        aria-invalid={!!errors.progress}
        aria-describedby={errors.progress ? errorId : undefined}
        className="h-8 w-20 rounded-lg bg-background/60 px-2.5 tabular-nums md:text-sm"
        {...register("progress", { valueAsNumber: true, onBlur: save })}
      />
      {errors.progress && (
        <p id={errorId} className="text-xs text-destructive">
          {errors.progress.message}
        </p>
      )}
    </form>
  )
}
