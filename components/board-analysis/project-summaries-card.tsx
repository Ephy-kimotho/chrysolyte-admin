import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/format"
import type {
  BoardProjectSummary,
  ProjectHealthStatus,
} from "@/lib/types/board-analysis"

const statusVariants = {
  "On track": "secondary",
  "At risk": "warning",
  Behind: "destructive",
} as const satisfies Record<ProjectHealthStatus, string>

type ProjectSummariesCardProps = {
  projects: BoardProjectSummary[]
}

export function ProjectSummariesCard({ projects }: ProjectSummariesCardProps) {
  return (
    <Card className="h-full break-inside-avoid rounded-2xl">
      <CardHeader className="px-5">
        <CardTitle className="text-base font-bold text-heading">
          Project summaries
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No projects to summarise yet.
          </p>
        ) : (
          <ul className="divide-y">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 font-semibold text-balance">
                    {project.name}
                  </h3>
                  <Badge
                    variant={statusVariants[project.status]}
                    className="h-6 shrink-0 font-semibold"
                  >
                    {project.status}
                  </Badge>
                </div>
                <Progress
                  value={project.progress}
                  aria-label={`${project.name} progress`}
                  className="h-1.5 [&>[data-slot=progress-indicator]]:bg-chart-1"
                />
                <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="tabular-nums">
                    {project.progress}% · {project.phase}
                  </span>
                  <span className="tabular-nums">
                    Balance{" "}
                    {formatCurrency(project.contractValue - project.receipts)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
