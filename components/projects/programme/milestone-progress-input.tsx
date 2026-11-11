"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { useUpdateMilestoneProgress } from "@/hooks/use-update-milestone-progress"
import { milestoneProgressSchema } from "@/lib/schemas/programme"
import type {
  Milestone,
  MilestoneProgressFormValues,
} from "@/lib/types/programme"

type MilestoneProgressInputProps = {
  milestone: Pick<Milestone, "id" | "name" | "progress">
}

/**
 * Inline progress field for a milestone row. It saves on blur or Enter, and
 * project progress updates to match.
 */
export function MilestoneProgressInput({
  milestone,
}: MilestoneProgressInputProps) {
  const updateProgress = useUpdateMilestoneProgress()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MilestoneProgressFormValues>({
    resolver: zodResolver(milestoneProgressSchema),
    // Follows the saved value, e.g. after another update.
    values: { progress: milestone.progress },
  })
  const errorId = `milestone-progress-error-${milestone.id}`

  function onSubmit(data: MilestoneProgressFormValues) {
    if (data.progress === milestone.progress) return
    updateProgress.mutate({ id: milestone.id, data })
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
        aria-label={`${milestone.name} progress (%)`}
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
