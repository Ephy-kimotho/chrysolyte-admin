"use client"

import { useState } from "react"

import { LoadError } from "@/components/load-error"
import { PageBanner } from "@/components/page-banner"
import { ProjectCombobox } from "@/components/projects/project-combobox"
import { ProjectInstructionsTable } from "@/components/projects/project-instructions-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/hooks/use-projects"

export function ConsultantsView() {
  const projects = useProjects()
  // "" until someone picks a project; the first project shows meanwhile.
  const [chosenProjectId, setChosenProjectId] = useState("")
  const projectId = chosenProjectId || projects.data?.[0]?.id

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="Project Consultants Portal"
        description="Architects, engineers and quantity surveyors can review assigned project status and record trackable site instructions."
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
          No projects yet. Instructions are recorded against a project.
        </p>
      ) : (
        <ProjectInstructionsTable
          projectId={projectId}
          titleId="instructions-register-heading"
          title="Consultant instructions register"
          controls={
            <>
              <label
                htmlFor="instructions-register-project"
                className="sr-only"
              >
                Project
              </label>
              <ProjectCombobox
                id="instructions-register-project"
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
