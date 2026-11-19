"use client"

import { LoadError } from "@/components/load-error"
import { AddProjectDialog } from "@/components/projects/add-project-dialog"
import { ProjectCard } from "@/components/projects/project-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/hooks/use-projects"
import { useAuth } from "@/providers/auth-provider"

// Columns fill in as projects are added: as many 18rem-wide cards as fit, but
// never more than 3 per row (each track is at least a third of the row, minus
// the two 1rem gaps). min(100%, …) keeps one card from overflowing on very
// narrow screens.
const gridClassName =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(18rem,calc((100%-2rem)/3))),1fr))] gap-4"

export function ProjectsView() {
  const projects = useProjects()
  const { isClient } = useAuth()

  return (
    <section
      aria-labelledby="project-portfolio-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="project-portfolio-heading"
          className="font-heading text-xl font-bold text-heading"
        >
          Project portfolio
        </h2>
        {/* Clients can view their projects but not create them. */}
        {!isClient && <AddProjectDialog />}
      </div>

      {projects.isPending ? (
        <ProjectsSkeleton />
      ) : projects.isError ? (
        <LoadError
          error={projects.error}
          fallback="We couldn't load the projects."
          onRetry={() => projects.refetch()}
          isRetrying={projects.isFetching}
        />
      ) : projects.data.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          {isClient
            ? "You don't have any projects yet."
            : "No projects yet. Add one to start tracking it here."}
        </p>
      ) : (
        <ul className={gridClassName}>
          {projects.data.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const skeletonCards = [0, 1, 2]

function ProjectsSkeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading projects…
      </p>
      <div className={gridClassName}>
        {skeletonCards.map((card) => (
          <Card key={card} className="gap-0 rounded-2xl py-0">
            <Skeleton className="h-40 rounded-none" />
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="mt-1 h-2 w-full rounded-full" />
              <div className="flex justify-between gap-4">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
