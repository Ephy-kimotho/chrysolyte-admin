"use client"

import { LoadError } from "@/components/load-error"
import { PageBanner } from "@/components/page-banner"
import {
  ProjectGrid,
  ProjectGridSkeleton,
} from "@/components/projects/project-grid"
import { useProjects } from "@/hooks/use-projects"

export function ConstructionView() {
  const projects = useProjects({ division: "Construction" })
  const constructionProjects = projects.data ?? []

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="Construction Operations Portal"
        description="Programme control, field personnel, reports, instructions, project stores and labour tracking."
      />

      {projects.isPending ? (
        <ProjectGridSkeleton removable={false} />
      ) : projects.isError ? (
        <LoadError
          error={projects.error}
          fallback="We couldn't load the projects."
          onRetry={() => projects.refetch()}
          isRetrying={projects.isFetching}
        />
      ) : constructionProjects.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No projects are in construction yet.
        </p>
      ) : (
        <ProjectGrid projects={constructionProjects} removable={false} />
      )}
    </div>
  )
}
