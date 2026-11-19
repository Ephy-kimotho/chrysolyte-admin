"use client"

import { TableCard } from "@/components/table-card"
import { useStaffNames } from "@/hooks/use-staff-names"
import type { Project } from "@/lib/types/projects"

type ProjectProfileCardProps = {
  project: Project
}

export function ProjectProfileCard({ project }: ProjectProfileCardProps) {
  const staffNames = useStaffNames()
  const staffName = (id: string | null) => (id ? staffNames.get(id) : null)

  const details = [
    { label: "Client", value: project.client },
    { label: "Supervisor", value: staffName(project.supervisorId) },
    { label: "Project Manager", value: staffName(project.projectManagerId) },
    { label: "Start", value: project.startDate },
    { label: "Deadline", value: project.dueDate },
  ]

  return (
    <TableCard
      titleId="project-profile-heading"
      title="Project profile"
      titleClassName="pt-2 text-lg"
    >
      <dl className="flex flex-col gap-1 text-sm leading-relaxed">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="inline font-bold">{detail.label}:</dt>{" "}
            <dd className="inline tabular-nums">{detail.value ?? "—"}</dd>
          </div>
        ))}
        <div className="pt-3">
          <dt className="inline font-bold">Internal note:</dt>{" "}
          <dd className="inline">{project.internalNote ?? "—"}</dd>
        </div>
      </dl>
    </TableCard>
  )
}
