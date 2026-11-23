import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/format"
import type { BoardProjectSummary } from "@/lib/types/board-analysis"

type ProjectSummariesCardProps = {
  projects: BoardProjectSummary[]
  /** Completion by project id; a project missing from it shows no bar. */
  progressById: Map<string, number>
}

export function ProjectSummariesCard({
  projects,
  progressById,
}: ProjectSummariesCardProps) {
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
            {projects.map((project) => {
              const progress = progressById.get(project.id)

              return (
                <li
                  key={project.id}
                  className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 font-semibold text-balance">
                      {project.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="h-6 shrink-0 font-semibold"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  {progress !== undefined && (
                    <Progress
                      value={progress}
                      aria-label={`${project.name} progress`}
                      className="h-1.5 [&>[data-slot=progress-indicator]]:bg-chart-1"
                    />
                  )}
                  <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="tabular-nums">
                      {progress !== undefined && `${progress}% · `}
                      {project.division} · Due{" "}
                      <time dateTime={project.deadline}>
                        {formatDate(project.deadline)}
                      </time>
                    </span>
                    <span className="tabular-nums">
                      Balance{" "}
                      {formatCurrency(
                        project.contractValue - project.collected
                      )}
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
