"use client"

import { LoadError } from "@/components/load-error"
import { AddProjectDialog } from "@/components/projects/add-project-dialog"
import {
  ProjectGrid,
  ProjectGridSkeleton,
} from "@/components/projects/project-grid"
import { useProjects } from "@/hooks/use-projects"
import { useAuth } from "@/providers/auth-provider"

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
        <ProjectGridSkeleton />
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
        <ProjectGrid projects={projects.data} />
      )}
    </section>
  )
}
