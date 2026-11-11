"use client"

import Link from "next/link"

import { PageBanner } from "@/components/page-banner"
import { tableCardActionClassName } from "@/components/table-card"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects"

export function ConstructionView() {
  const { data: projects } = useProjects()
  const constructionProjects = projects.filter(
    (project) => project.phase === "Construction"
  )

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="Construction Operations Portal"
        description="Programme control, field personnel, reports, instructions, project stores and labour tracking."
      />

      {constructionProjects.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No projects are in construction yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {constructionProjects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
            >
              <h2 className="pt-2 font-heading text-lg font-bold">
                {project.name}
              </h2>
              <p className="text-sm">
                <span className="tabular-nums">{project.progress}%</span>{" "}
                complete · {project.location}
              </p>
              <Button asChild className={tableCardActionClassName}>
                <Link
                  href={`/projects/${project.id}`}
                  aria-label={`Open operations for ${project.name}`}
                >
                  Open operations
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
