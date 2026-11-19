"use client"

import { MilestonesCard } from "@/components/projects/programme/milestones-card"
import { WorkProgrammeCard } from "@/components/projects/programme/work-programme-card"
import { useProgrammeActivities } from "@/hooks/use-programme-activities"

export function ProjectProgrammeTab({ projectId }: { projectId: string }) {
  const { data: activities = [] } = useProgrammeActivities(projectId)

  return (
    <div className="flex flex-col gap-4">
      <MilestonesCard projectId={projectId} />
      <WorkProgrammeCard projectId={projectId} activities={activities} />
    </div>
  )
}
