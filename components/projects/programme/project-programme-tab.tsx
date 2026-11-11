"use client"

import { MilestonesCard } from "@/components/projects/programme/milestones-card"
import { WorkProgrammeCard } from "@/components/projects/programme/work-programme-card"
import { useProjectProgramme } from "@/hooks/use-project-programme"

export function ProjectProgrammeTab({ projectId }: { projectId: string }) {
  const { data: programme } = useProjectProgramme(projectId)

  return (
    <div className="flex flex-col gap-4">
      <MilestonesCard projectId={projectId} milestones={programme.milestones} />
      <WorkProgrammeCard
        projectId={projectId}
        activities={programme.activities}
      />
    </div>
  )
}
