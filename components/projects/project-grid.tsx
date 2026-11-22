import { ProjectCard } from "@/components/projects/project-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Project } from "@/lib/types/projects"

// Columns fill in as projects are added: as many 18rem-wide cards as fit, but
// never more than 3 per row (each track is at least a third of the row, minus
// the two 1rem gaps). min(100%, …) keeps one card from overflowing on very
// narrow screens.
const gridClassName =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(18rem,calc((100%-2rem)/3))),1fr))] gap-4"

type ProjectGridProps = {
  projects: Project[]
  /** Offers the Remove action on each card. On by default. */
  removable?: boolean
}

/** Projects as a grid of cards, up to three per row. */
export function ProjectGrid({ projects, removable = true }: ProjectGridProps) {
  return (
    <ul className={gridClassName}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} removable={removable} />
        </li>
      ))}
    </ul>
  )
}

const skeletonCards = [0, 1, 2]

/** Placeholder cards shaped like `ProjectGrid`, while the projects load. */
export function ProjectGridSkeleton({
  removable = true,
}: {
  removable?: boolean
}) {
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
                {removable && <Skeleton className="h-9 w-24 rounded-full" />}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
