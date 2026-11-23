"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { ProjectInstructionsTable } from "@/components/projects/project-instructions-table"
import { ProjectSiteStaffTab } from "@/components/projects/project-site-staff-tab"
import { ProjectStoreTab } from "@/components/projects/project-store-tab"
import { ProjectProgrammeTab } from "@/components/projects/programme/project-programme-tab"
import { ProjectPhotosCard } from "@/components/projects/project-photos-card"
import { ProjectProfileCard } from "@/components/projects/project-profile-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { LoadError } from "@/components/load-error"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProject } from "@/hooks/use-project"
import { useProjectAssignments } from "@/hooks/use-project-assignments"
import { useStaffNames } from "@/hooks/use-staff-names"
import { useTransactions } from "@/hooks/use-transactions"
import { sumTransactions } from "@/lib/api/financials"
import { formatCurrency } from "@/lib/format"

const sections = [
  { value: "overview", label: "Overview" },
  { value: "milestones", label: "Milestones & programme" },
  { value: "site-staff", label: "Site staff & wages" },
  { value: "instructions", label: "Instructions" },
  { value: "store", label: "Project store" },
] as const

type ProjectDetailsViewProps = {
  projectId: string
}

export function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  // The link shows in every state, so there's always a way back.
  return (
    <div className="flex flex-col gap-3">
      <Button
        asChild
        variant="ghost"
        className="-ml-2 h-9 w-fit rounded-full px-3 text-muted-foreground"
      >
        <Link href="/projects">
          <ChevronLeft aria-hidden="true" />
          All projects
        </Link>
      </Button>
      <ProjectDetails projectId={projectId} />
    </div>
  )
}

function ProjectDetails({ projectId }: ProjectDetailsViewProps) {
  const projectQuery = useProject(projectId)
  const { data: assignments } = useProjectAssignments(projectId)
  const staffNames = useStaffNames()
  const { data: transactions } = useTransactions({ projectId })
  const project = projectQuery.data

  if (projectQuery.isPending) return <ProjectDetailsSkeleton />

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

  if (!project) {
    return (
      <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
        This project doesn&apos;t exist or has been removed.
      </p>
    )
  }

  // Undefined until the project's transactions load.
  const finances = transactions && sumTransactions(transactions)
  const meta = [
    project.phase,
    project.contractType,
    project.location,
    project.leadConsultantId &&
      staffNames.has(project.leadConsultantId) &&
      `Manager: ${staffNames.get(project.leadConsultantId)}`,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="project-name-heading"
        className="flex flex-col gap-2 rounded-2xl bg-linear-to-r from-accent to-primary/45 px-5 py-6 text-accent-foreground sm:px-6 sm:pb-10"
      >
        <p className="text-xs text-accent-foreground/75 tabular-nums">
          {project.code}
        </p>
        <h2
          id="project-name-heading"
          className="font-heading text-2xl font-bold text-balance sm:text-3xl"
        >
          {project.name}
        </h2>
        <p className="pt-2 text-sm">{meta.join(" · ")}</p>
      </section>

      <section
        aria-label="Key figures"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          value={`${project.progress}%`}
          label="Milestone-derived progress"
        />
        <StatCard
          value={assignments ? assignments.length : "—"}
          label="Assigned staff"
        />
        <StatCard
          value={finances ? formatCurrency(finances.clientPaid) : "—"}
          label="Client receipts"
        />
        <StatCard
          value={
            finances
              ? formatCurrency(project.budget - finances.recordedCosts)
              : "—"
          }
          label="Budget remaining"
        />
      </section>

      <Tabs defaultValue="overview" className="gap-4">
        {/* One scrollable row on small screens, so the tabs never wrap. */}
        <TabsList className="h-auto! w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0">
          {sections.map((section) => (
            <TabsTrigger
              key={section.value}
              value={section.value}
              className="h-10 flex-none rounded-xl border-border bg-card px-3.5 text-sm font-normal text-foreground after:hidden hover:bg-muted data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ProjectProfileCard project={project} />
            </div>
            <div className="lg:col-span-2">
              <ProjectPhotosCard project={project} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <ProjectProgrammeTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="site-staff">
          <ProjectSiteStaffTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="instructions">
          <ProjectInstructionsTable projectId={project.id} />
        </TabsContent>

        <TabsContent value="store">
          <ProjectStoreTab project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectDetailsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        Loading project…
      </p>
      <div className="flex flex-col gap-3 rounded-2xl bg-muted px-5 py-6 sm:px-6 sm:pb-10">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <Skeleton key={card} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}
