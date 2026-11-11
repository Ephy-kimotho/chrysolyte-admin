import { TableCard } from "@/components/table-card"
import type { Project } from "@/lib/types/projects"

type ProjectProfileCardProps = {
  project: Project
}

export function ProjectProfileCard({ project }: ProjectProfileCardProps) {
  const details = [
    { label: "Client", value: project.client },
    { label: "Supervisor", value: project.supervisor },
    { label: "Project Manager", value: project.projectManager },
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
