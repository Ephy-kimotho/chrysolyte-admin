"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { AddEmergencyContactDialog } from "@/components/staff/add-emergency-contact-dialog"
import { AddStaffSkillDialog } from "@/components/staff/add-staff-skill-dialog"
import { DeleteEmergencyContactDialog } from "@/components/staff/delete-emergency-contact-dialog"
import { DeleteStaffPhotoDialog } from "@/components/staff/delete-staff-photo-dialog"
import { DeleteStaffSkillDialog } from "@/components/staff/delete-staff-skill-dialog"
import { StaffActions } from "@/components/staff/staff-actions"
import { StaffHealthBadge } from "@/components/staff/staff-health-badge"
import { UploadStaffPhotoDialog } from "@/components/staff/upload-staff-photo-dialog"
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjects } from "@/hooks/use-projects"
import { isStaffNotFound, useStaffProfile } from "@/hooks/use-staff-profile"
import { getErrorMessage } from "@/lib/api/errors"
import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  pluralize,
} from "@/lib/format"
import {
  inactiveAfterDays,
  type EmergencyContact,
  type StaffMember,
  type StaffSkill,
} from "@/lib/types/staff"

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
  action,
  children,
}: {
  title: string
  description?: string
  /** Sits at the top right of the card, e.g. an add button. */
  action?: React.ReactNode
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
        {action && <CardAction className="self-center">{action}</CardAction>}
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

function StaffSkills({
  staffId,
  staffName,
  skills,
}: {
  staffId: string
  staffName: string
  skills: StaffSkill[]
}) {
  return (
    <Section
      title="Credentials & competences"
      action={<AddStaffSkillDialog staffId={staffId} staffName={staffName} />}
    >
      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No skills recorded yet. Add their credentials and competences.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-medium break-words">{skill.skill}</p>
                  <Badge variant="secondary" className="h-6">
                    {skill.category}
                  </Badge>
                </div>
                {skill.description && (
                  <p className="text-sm break-words text-muted-foreground">
                    {skill.description}
                  </p>
                )}
              </div>
              <div className="-mr-2 shrink-0">
                <DeleteStaffSkillDialog
                  skill={skill}
                  staffId={staffId}
                  staffName={staffName}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function EmergencyContacts({
  staffId,
  staffName,
  contacts,
}: {
  staffId: string
  staffName: string
  contacts: EmergencyContact[]
}) {
  return (
    <Section
      title="Emergency contacts"
      action={
        <AddEmergencyContactDialog staffId={staffId} staffName={staffName} />
      }
    >
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No emergency contacts yet. Add someone to call if something happens at
          work.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="font-medium break-words">{contact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {contact.relationship}
                </p>
                <a
                  href={`tel:${contact.phone}`}
                  className={`${linkClassName} w-fit text-sm tabular-nums`}
                >
                  {formatPhoneNumber(contact.phone)}
                </a>
              </div>
              <div className="-mr-2 shrink-0">
                <DeleteEmergencyContactDialog
                  contact={contact}
                  staffId={staffId}
                  staffName={staffName}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

type StaffProfileViewProps = {
  staffId: string
}

export function StaffProfileView({ staffId }: StaffProfileViewProps) {
  const router = useRouter()
  const profile = useStaffProfile(staffId)
  const { data: projects } = useProjects()

  if (profile.isPending) {
    return (
      <div aria-busy="true" className="flex flex-col gap-4">
        <BackLink />
        <p role="status" className="sr-only">
          Loading staff profile…
        </p>
        <Card className="rounded-2xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="size-24 shrink-0 rounded-full sm:size-28" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (profile.isError && isStaffNotFound(profile.error)) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          This staff member doesn&apos;t exist or has been removed.
        </p>
      </div>
    )
  }

  if (profile.isError) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(
              profile.error,
              "We couldn't load this staff profile."
            )}
          </p>
          <Button
            variant="outline"
            onClick={() => profile.refetch()}
            disabled={profile.isFetching}
            className="h-10 rounded-full px-5"
          >
            {profile.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      </div>
    )
  }

  const { member, skills, emergencyContacts } = profile.data
  const project = projects.find((item) => item.id === member.projectId)
  const { daysSinceActive } = member
  const isInactive =
    daysSinceActive !== null && daysSinceActive > inactiveAfterDays
  // A return date only matters while they're off full duty.
  const returnToWork = member.health === "Fit" ? null : member.returnToWork

  return (
    <div className="flex flex-col gap-4">
      <BackLink />

      <Card className="relative rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-fit shrink-0">
            <UserAvatar
              name={member.fullName}
              src={member.photoUrl}
              className="size-24 text-2xl sm:size-28 sm:text-3xl"
            />
            {member.photoUrl ? (
              <DeleteStaffPhotoDialog
                staffId={member.id}
                staffName={member.fullName}
              />
            ) : (
              <UploadStaffPhotoDialog
                staffId={member.id}
                staffName={member.fullName}
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h2 className="font-heading text-2xl font-bold text-balance text-heading">
              {member.fullName}
            </h2>
            <p className="text-muted-foreground">
              {member.role} · {member.division}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="h-6 tabular-nums">
                {member.idNo}
              </Badge>
              <StaffHealthBadge health={member.health} />
              {!member.isActive && (
                <Badge variant="outline" className="h-6 font-semibold">
                  Inactive
                </Badge>
              )}
              {isInactive && (
                <Badge variant="destructive" className="h-6 font-semibold">
                  {daysSinceActive} {pluralize(daysSinceActive, "day", "days")}{" "}
                  inactive
                </Badge>
              )}
            </div>
          </div>
          {/* Top right on phones, where the details stack under the photo. */}
          <div className="absolute top-3 right-3 sm:static sm:shrink-0">
            <StaffActions
              member={member}
              onDeleted={() => router.replace(staffListHref)}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <KpiPerformance member={member} />

          <StaffSkills
            staffId={member.id}
            staffName={member.fullName}
            skills={skills}
          />

          <EmergencyContacts
            staffId={member.id}
            staffName={member.fullName}
            contacts={emergencyContacts}
          />
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
                  label: "Employment type",
                  value: member.employmentType,
                },
                {
                  label: "Start date",
                  value: (
                    <time dateTime={member.startDate}>
                      {formatDate(member.startDate)}
                    </time>
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
                ...(returnToWork
                  ? [
                      {
                        label: "Return to work",
                        value: (
                          <time dateTime={returnToWork}>
                            {formatDate(returnToWork)}
                          </time>
                        ),
                      },
                    ]
                  : []),
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
                  label: "Last active",
                  value:
                    member.lastActiveOn === null ? (
                      "No activity yet"
                    ) : (
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
