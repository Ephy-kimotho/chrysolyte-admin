"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera, DraftingCompass, HardHat } from "lucide-react"

import { RemoveProjectDialog } from "@/components/projects/remove-project-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUpdateProjectCover } from "@/hooks/use-update-project-cover"
import { formatDate } from "@/lib/format"
import type { Project, ProjectPhase } from "@/lib/types/projects"

const phaseIcons: Record<ProjectPhase, typeof HardHat> = {
  Construction: HardHat,
  Design: DraftingCompass,
}

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateCover = useUpdateProjectCover()
  const PhaseIcon = phaseIcons[project.phase]

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the input so choosing the same file again still fires a change.
    event.target.value = ""
    if (file) updateCover.mutate({ id: project.id, data: { file } })
  }

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

        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={() => fileInputRef.current?.click()}
          disabled={updateCover.isPending}
          aria-label={`Change cover photo of ${project.name}`}
          className="absolute right-3 bottom-3 rounded-xl bg-black/40 text-foreground backdrop-blur-sm hover:bg-black/60 hover:text-foreground"
        >
          <Camera />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleCoverChange}
          className="sr-only"
        />
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
          className="mt-1 h-2 [&>[data-slot=progress-indicator]]:bg-chart-1"
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
          <RemoveProjectDialog project={project} />
        </div>
      </div>
    </Card>
  )
}
