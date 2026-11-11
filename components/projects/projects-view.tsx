"use client"

import { AddProjectDialog } from "@/components/projects/add-project-dialog"
import { ProjectCard } from "@/components/projects/project-card"
import { useProjects } from "@/hooks/use-projects"

export function ProjectsView() {
  const { data: projects } = useProjects()

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
        <AddProjectDialog />
      </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No projects yet. Add one to start tracking it here.
        </p>
      ) : (
        // Columns fill in as projects are added: as many 18rem-wide cards as
        // fit, but never more than 3 per row (each track is at least a third
        // of the row, minus the two 1rem gaps). min(100%, …) keeps one card
        // from overflowing on very narrow screens.
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(18rem,calc((100%_-_2rem)/3))),1fr))] gap-4">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
