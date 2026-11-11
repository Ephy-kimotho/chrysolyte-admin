"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { RemoveStaffDialog } from "@/components/staff/remove-staff-dialog"
import { StaffHealthBadge } from "@/components/staff/staff-health-badge"
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProjects } from "@/hooks/use-projects"
import { useStaffMember } from "@/hooks/use-staff-member"
import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  pluralize,
} from "@/lib/format"
import { inactiveAfterDays, type StaffMember } from "@/lib/types/staff"

const staffListHref = "/staff-kpi"

const linkClassName =
  "rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"

function BackLink() {
  return (
    <Button
      asChild
      variant="ghost"
      className="-ml-2 h-9 w-fit rounded-full px-3 text-muted-foreground"
    >
      <Link href={staffListHref}>
        <ChevronLeft aria-hidden="true" />
        All staff
      </Link>
    </Button>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="gap-1 px-5">
        <CardTitle className="text-base font-bold text-heading">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="px-5">{children}</CardContent>
    </Card>
  )
}

function DetailList({
  items,
}: {
  items: { label: string; value: React.ReactNode }[]
}) {
  return (
    <dl className="flex flex-col divide-y">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"
        >
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function KpiPerformance({ member }: { member: StaffMember }) {
  const { kpi, kpiEfficiency } = member

  if (!kpi || kpiEfficiency === null) {
    return (
      <Section title="KPI performance">
        <p className="text-sm text-muted-foreground">
          Not rated yet. Scores appear here after {member.fullName}&apos;s first
          review.
        </p>
      </Section>
    )
  }

  const scores = [
    { label: "Attendance", value: kpi.attendance },
    { label: "Quality", value: kpi.quality },
    { label: "Timeliness", value: kpi.timeliness },
    { label: "Teamwork", value: kpi.teamwork },
  ]

  return (
    <Section
      title="KPI performance"
      description="Efficiency is the average of the four scores."
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 flex-col gap-1 sm:w-36">
          <p className="font-heading text-4xl font-bold text-heading tabular-nums">
            {kpiEfficiency}%
          </p>
          <p className="text-sm text-muted-foreground">KPI efficiency</p>
        </div>

        <ul className="grid flex-1 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {scores.map((score) => (
            <li key={score.label} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span>{score.label}</span>
                <span className="font-semibold tabular-nums">
                  {score.value}
                </span>
              </div>
              <Progress
                value={score.value}
                aria-label={`${score.label} score`}
                className="h-1.5 [&>[data-slot=progress-indicator]]:bg-chart-1"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

type StaffProfileViewProps = {
  staffId: string
}

export function StaffProfileView({ staffId }: StaffProfileViewProps) {
  const router = useRouter()
  const { data: member } = useStaffMember(staffId)
  const { data: projects } = useProjects()

  if (!member) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          This staff member doesn&apos;t exist or has been removed.
        </p>
      </div>
    )
  }

  const project = projects.find((item) => item.id === member.projectId)
  const isInactive = member.daysSinceActive > inactiveAfterDays

  return (
    <div className="flex flex-col gap-4">
      <BackLink />

      <Card className="rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <UserAvatar
            name={member.fullName}
            src={member.photoUrl}
            className="size-16 shrink-0 text-lg"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h2 className="font-heading text-2xl font-bold text-balance text-heading">
              {member.fullName}
            </h2>
            <p className="text-muted-foreground">
              {member.role} · {member.division}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="h-6 tabular-nums">
                {member.staffNumber}
              </Badge>
              <StaffHealthBadge health={member.health} />
              {isInactive && (
                <Badge variant="destructive" className="h-6 font-semibold">
                  {member.daysSinceActive}{" "}
                  {pluralize(member.daysSinceActive, "day", "days")} inactive
                </Badge>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <RemoveStaffDialog
              member={member}
              trigger="button"
              onRemoved={() => router.replace(staffListHref)}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <KpiPerformance member={member} />

          <Section title="Credentials & competences">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">Qualification</p>
                <p>{member.qualification}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">Competences</p>
                {member.competences.length === 0 ? (
                  <p className="text-muted-foreground">None recorded</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {member.competences.map((competence) => (
                      <li key={competence}>
                        <Badge variant="secondary" className="h-7 px-3">
                          {competence}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-4">
          <Section title="Contact">
            <DetailList
              items={[
                {
                  label: "Email",
                  value: (
                    <a
                      href={`mailto:${member.email}`}
                      className={`${linkClassName} break-all`}
                    >
                      {member.email}
                    </a>
                  ),
                },
                {
                  label: "Phone",
                  value: (
                    <a
                      href={`tel:${member.phone}`}
                      className={`${linkClassName} tabular-nums`}
                    >
                      {formatPhoneNumber(member.phone)}
                    </a>
                  ),
                },
              ]}
            />
          </Section>

          <Section title="Employment">
            <DetailList
              items={[
                {
                  label: "Assignment",
                  value: project ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className={linkClassName}
                    >
                      {project.name}
                    </Link>
                  ) : (
                    "Unassigned"
                  ),
                },
                {
                  label: "Daily rate",
                  value: (
                    <span className="tabular-nums">
                      {formatCurrency(member.dailyRate)}
                    </span>
                  ),
                },
                {
                  label: "Last active",
                  value: (
                    <time dateTime={member.lastActiveOn}>
                      {member.daysSinceActive === 0
                        ? "Today"
                        : formatDate(member.lastActiveOn)}
                    </time>
                  ),
                },
              ]}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}
