"use client"

import Image from "next/image"
import Link from "next/link"
import { DraftingCompass, HardHat } from "lucide-react"

import { RemoveProjectDialog } from "@/components/projects/remove-project-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/format"
import type { Project, ProjectPhase } from "@/lib/types/projects"

const phaseIcons: Record<ProjectPhase, typeof HardHat> = {
  Construction: HardHat,
  Design: DraftingCompass,
}

type ProjectCardProps = {
  project: Project
  /** Offers the Remove action. On by default. */
  removable?: boolean
}

export function ProjectCard({ project, removable = true }: ProjectCardProps) {
  const PhaseIcon = phaseIcons[project.phase]

  return (
    <Card className="h-full gap-0 rounded-2xl py-0">
      <div className="relative h-40 bg-linear-to-br from-accent to-secondary">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={`Cover photo of ${project.name}`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PhaseIcon
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-12 text-heading/70"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="secondary" className="h-6 font-semibold">
          {project.phase}
        </Badge>

        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-base font-bold text-balance">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {project.code} · {project.location}
          </p>
        </div>

        <Progress
          value={project.progress}
          aria-label={`${project.name} progress`}
          className="mt-1 h-2 *:data-[slot=progress-indicator]:bg-chart-1"
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {project.progress}% automatic progress
          </span>
          <span>Due {formatDate(project.dueDate)}</span>
        </div>

        {/* mt-auto keeps the actions aligned across cards of different heights. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button asChild className="h-9 rounded-full px-4 font-semibold">
            <Link href={`/projects/${project.id}`}>Open project</Link>
          </Button>
          {removable && <RemoveProjectDialog project={project} />}
        </div>
      </div>
    </Card>
  )
}
