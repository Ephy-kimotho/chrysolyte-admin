"use client"

import { ProgressInput } from "@/components/projects/programme/progress-input"
import { useUpdateMilestoneProgress } from "@/hooks/use-update-milestone-progress"
import type { Milestone } from "@/lib/types/programme"

/** A milestone's inline progress field. Project progress updates to match. */
export function MilestoneProgressInput({
  milestone,
}: {
  milestone: Milestone
}) {
  const updateProgress = useUpdateMilestoneProgress()

  return (
    <ProgressInput
      id={`milestone-${milestone.id}`}
      name={milestone.name}
      value={milestone.progress}
      isSaving={updateProgress.isPending}
      onSave={(data, onError) =>
        updateProgress.mutate({ milestone, data }, { onError })
      }
    />
  )
}
