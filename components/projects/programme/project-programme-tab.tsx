import { MilestonesCard } from "@/components/projects/programme/milestones-card"
import { WorkProgrammeCard } from "@/components/projects/programme/work-programme-card"

export function ProjectProgrammeTab({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <MilestonesCard projectId={projectId} />
      <WorkProgrammeCard projectId={projectId} />
    </div>
  )
}
