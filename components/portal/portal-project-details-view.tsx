"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { LoadError } from "@/components/load-error"
import {
  formatBalance,
  formatContractValue,
} from "@/components/portal/project-money"
import { PortalProjectStatusBadge } from "@/components/portal/portal-project-status-badge"
import { TableCard } from "@/components/table-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortalProject } from "@/hooks/use-portal-project"
import {
  formatCurrency,
  formatDate,
  formatNumber,
  pluralize,
} from "@/lib/format"
import type {
  PortalMilestone,
  PortalPayment,
  PortalProjectDetails as PortalProjectDetailsData,
} from "@/lib/types/portal"

type PortalProjectDetailsViewProps = {
  projectId: string
}

export function PortalProjectDetailsView({
  projectId,
}: PortalProjectDetailsViewProps) {
  // The link shows in every state, so there's always a way back.
  return (
    <div className="flex flex-col gap-3">
      <Button
        asChild
        variant="ghost"
        className="-ml-2 h-9 w-fit rounded-full px-3 text-muted-foreground"
      >
        <Link href="/portal/projects">
          <ChevronLeft aria-hidden="true" />
          All projects
        </Link>
      </Button>
      <PortalProjectDetails projectId={projectId} />
    </div>
  )
}

function PortalProjectDetails({ projectId }: PortalProjectDetailsViewProps) {
  const projectQuery = usePortalProject(projectId)

  if (projectQuery.isPending) return <PortalProjectDetailsSkeleton />

  if (projectQuery.isError) {
    return (
      <LoadError
        error={projectQuery.error}
        fallback="We couldn't load this project."
        onRetry={() => projectQuery.refetch()}
        isRetrying={projectQuery.isFetching}
      />
    )
  }

  // Null when the project doesn't exist or belongs to another client.
  const project = projectQuery.data

  if (!project) {
    return (
      <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
        This project doesn&apos;t exist or isn&apos;t shared with you.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="portal-project-heading"
        className="flex flex-col gap-2 rounded-2xl bg-linear-to-r from-accent to-primary/45 px-5 py-6 text-accent-foreground sm:px-6 sm:pb-10"
      >
        <p className="text-xs text-accent-foreground/75 tabular-nums">
          {project.id}
        </p>
        <h2
          id="portal-project-heading"
          className="font-heading text-2xl font-bold text-balance sm:text-3xl"
        >
          {project.name}
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-sm">
          <PortalProjectStatusBadge status={project.status} />
          <span>Due {formatDate(project.deadline)}</span>
        </div>
      </section>

      <section
        aria-label="Key figures"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          value={`${formatNumber(project.progress)}%`}
          label="Complete"
        />
        <StatCard value={formatContractValue(project)} label="Contract value" />
        <StatCard
          value={formatCurrency(project.collected)}
          label="Paid to date"
        />
        <StatCard value={formatBalance(project)} label="Balance" />
      </section>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MilestonesCard milestones={project.milestones} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          {project.clientNote && (
            <Card className="gap-2 rounded-2xl p-5">
              <h3 className="font-heading text-lg font-bold text-heading">
                Note from Chrysolyte
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {project.clientNote}
              </p>
            </Card>
          )}
          {project.photoUrl && <ProjectPhoto project={project} />}
          <Card className="gap-2 rounded-2xl p-5">
            <h3 className="font-heading text-lg font-bold text-heading">
              Site reports
            </h3>
            <p className="text-sm text-muted-foreground">
              {project.approvedReportCount === 0
                ? "No site reports have been shared yet."
                : `${project.approvedReportCount} approved ${pluralize(
                    project.approvedReportCount,
                    "site report has",
                    "site reports have"
                  )} been shared.`}
            </p>
          </Card>
        </div>
      </div>

      <PaymentsCard payments={project.payments} total={project.collected} />
    </div>
  )
}

function ProjectPhoto({
  project,
}: {
  project: Pick<PortalProjectDetailsData, "name" | "photoUrl">
}) {
  if (!project.photoUrl) return null
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl py-0">
      <div className="relative aspect-video">
        <Image
          src={project.photoUrl}
          alt={`Photo of ${project.name}`}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    </Card>
  )
}

function MilestoneBadge({ milestone }: { milestone: PortalMilestone }) {
  if (milestone.progress >= 100) {
    return (
      <Badge variant="success" className="h-6 font-semibold">
        Done
      </Badge>
    )
  }
  // ISO dates compare correctly as text.
  if (milestone.deadline < format(new Date(), "yyyy-MM-dd")) {
    return (
      <Badge variant="warning" className="h-6 font-semibold">
        Behind schedule
      </Badge>
    )
  }
  return null
}

function MilestonesCard({ milestones }: { milestones: PortalMilestone[] }) {
  return (
    <TableCard
      titleId="portal-milestones-heading"
      title="Milestones"
      titleClassName="text-xl text-heading"
    >
      {milestones.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          The programme for this project hasn&apos;t been shared yet.
        </p>
      ) : (
        <ol className="flex flex-col divide-y">
          {milestones.map((milestone, index) => (
            <li
              key={`${milestone.name}-${index}`}
              className="flex flex-col gap-2.5 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{milestone.name}</h3>
                <MilestoneBadge milestone={milestone} />
              </div>
              <Progress
                value={milestone.progress}
                aria-label={`${milestone.name} progress`}
                className="h-2 *:data-[slot=progress-indicator]:bg-chart-1"
              />
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {formatNumber(milestone.progress)}% complete ·{" "}
                  {formatNumber(milestone.weight)}% of the project
                </span>
                <span>Due {formatDate(milestone.deadline)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </TableCard>
  )
}

function PaymentsCard({
  payments,
  total,
}: {
  payments: PortalPayment[]
  total: number
}) {
  return (
    <TableCard
      titleId="portal-payments-heading"
      title="Payments"
      titleClassName="text-xl text-heading"
    >
      {payments.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          No payments recorded yet.
        </p>
      ) : (
        <>
          <ul className="flex flex-col divide-y">
            {payments.map((payment, index) => (
              <li
                key={`${payment.date}-${index}`}
                className="flex items-start justify-between gap-4 py-3 first:pt-0"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-sm wrap-break-word">
                    {payment.description}
                  </p>
                  <time
                    dateTime={payment.date}
                    className="text-xs text-muted-foreground tabular-nums"
                  >
                    {formatDate(payment.date)}
                  </time>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(payment.amount)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t pt-3 text-sm">
            <span className="font-semibold">Total paid</span>
            <span className="font-bold tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </>
      )}
    </TableCard>
  )
}

function PortalProjectDetailsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        Loading the project…
      </p>
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <Card key={card} className="gap-3 rounded-2xl px-5 py-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-28" />
          </Card>
        ))}
      </div>
      <Card className="gap-4 rounded-2xl p-5">
        <Skeleton className="h-6 w-32" />
        {[0, 1].map((row) => (
          <div key={row} className="flex flex-col gap-2 py-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </Card>
    </div>
  )
}
