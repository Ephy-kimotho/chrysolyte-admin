"use client"

import { ProgressInput } from "@/components/projects/programme/progress-input"
import { useUpdateActivityProgress } from "@/hooks/use-update-activity-progress"
import type { ProgrammeActivity } from "@/lib/types/programme"

/** An activity's inline progress field in the work programme. */
export function ActivityProgressInput({
  activity,
}: {
  activity: ProgrammeActivity
}) {
  const updateProgress = useUpdateActivityProgress()

  return (
    <ProgressInput
      id={`activity-${activity.id}`}
      name={activity.activity}
      value={activity.progress}
      isSaving={updateProgress.isPending}
      onSave={(data, onError) =>
        updateProgress.mutate({ activity, data }, { onError })
      }
    />
  )
}
