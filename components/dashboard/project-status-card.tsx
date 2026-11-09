import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/format"
import type { ProjectStatus } from "@/lib/types/dashboard"

function progressVariant(progress: number) {
  if (progress < 20) return "destructive"
  if (progress < 60) return "warning"
  return "secondary"
}

type ProjectStatusCardProps = {
  projects: ProjectStatus[]
}

export function ProjectStatusCard({ projects }: ProjectStatusCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="px-5">
        <CardTitle className="text-xl font-bold text-heading">
          Project status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        {projects.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            No projects to show yet.
          </p>
        ) : (
          <ul className="divide-y">
            {projects.map((project) => (
              <li key={project.id} className="flex flex-col gap-3 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <Badge
                    variant={progressVariant(project.progress)}
                    className="h-6 font-semibold tabular-nums"
                  >
                    {project.progress}%
                  </Badge>
                </div>
                <Progress
                  value={project.progress}
                  aria-label={`${project.name} progress`}
                  className="h-2 [&>[data-slot=progress-indicator]]:bg-chart-1"
                />
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {project.phase} · {project.location}
                  </span>
                  <span>Due {formatDate(project.dueDate)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
