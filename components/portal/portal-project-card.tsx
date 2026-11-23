import Image from "next/image"
import Link from "next/link"
import { Building2 } from "lucide-react"

import { formatBalance } from "@/components/portal/project-money"
import { PortalProjectStatusBadge } from "@/components/portal/portal-project-status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import type { PortalProject } from "@/lib/types/portal"

export function PortalProjectCard({ project }: { project: PortalProject }) {
  return (
    <Card className="h-full gap-0 rounded-2xl py-0">
      <div className="relative h-40 bg-linear-to-br from-accent to-secondary">
        {project.photoUrl ? (
          <Image
            src={project.photoUrl}
            alt={`Photo of ${project.name}`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Building2
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-12 text-heading/70"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <PortalProjectStatusBadge status={project.status} />

        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-base font-bold text-balance">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {project.id}
          </p>
        </div>

        <Progress
          value={project.progress}
          aria-label={`${project.name} progress`}
          className="mt-1 h-2 *:data-[slot=progress-indicator]:bg-chart-1"
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {formatNumber(project.progress)}% complete
          </span>
          <span>Due {formatDate(project.deadline)}</span>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Paid to date</dt>
            <dd className="font-semibold tabular-nums">
              {formatCurrency(project.collected)}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Balance</dt>
            <dd className="font-semibold tabular-nums">
              {formatBalance(project)}
            </dd>
          </div>
        </dl>

        {/* mt-auto keeps the button aligned across cards of different heights. */}
        <div className="mt-auto pt-1">
          <Button asChild className="h-9 rounded-full px-4 font-semibold">
            <Link href={`/portal/projects/${encodeURIComponent(project.id)}`}>
              View project
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
