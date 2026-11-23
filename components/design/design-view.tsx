"use client"

import { useState } from "react"

import { DesignDeliverablesTable } from "@/components/design/design-deliverables-table"
import { LoadError } from "@/components/load-error"
import { PageBanner } from "@/components/page-banner"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/hooks/use-projects"

export function DesignView() {
  const projects = useProjects()
  // "" until someone picks a project; the first project shows meanwhile.
  const [chosenProjectId, setChosenProjectId] = useState("")
  const projectId = chosenProjectId || projects.data?.[0]?.id

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="DESIGN PORTAL"
        description="Multi-project assignments, disciplines, deliverables, reviews, coordination and client approvals."
      />

      {projects.isPending ? (
        <div
          aria-busy="true"
          className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
        >
          <p role="status" className="sr-only">
            Loading projects…
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-11 w-64 rounded-xl" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      ) : projects.isError ? (
        <LoadError
          error={projects.error}
          fallback="We couldn't load the projects."
          onRetry={() => projects.refetch()}
          isRetrying={projects.isFetching}
        />
      ) : !projectId ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No projects yet. Design deliverables are tracked against a project.
        </p>
      ) : (
        <DesignDeliverablesTable
          projectId={projectId}
          controls={
            <>
              <label htmlFor="design-controls-project" className="sr-only">
                Project
              </label>
              <ProjectCombobox
                id="design-controls-project"
                value={projectId}
                // A project is always shown, so the choice can't be cleared.
                onChange={(option) =>
                  option && setChosenProjectId(option.value)
                }
                className="w-full sm:w-64"
              />
            </>
          }
        />
      )}
    </div>
  )
}
