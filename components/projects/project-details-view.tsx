"use client"

import { ProjectInstructionsTab } from "@/components/projects/project-instructions-tab"
import { ProjectSiteStaffTab } from "@/components/projects/project-site-staff-tab"
import { ProjectStoreTab } from "@/components/projects/project-store-tab"
import { ProjectProgrammeTab } from "@/components/projects/programme/project-programme-tab"
import { ProjectPhotosCard } from "@/components/projects/project-photos-card"
import { ProjectProfileCard } from "@/components/projects/project-profile-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFinancials } from "@/hooks/use-financials"
import { useProject } from "@/hooks/use-project"
import { useStaff } from "@/hooks/use-staff"
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
  const { data: project } = useProject(projectId)
  const { data: staff } = useStaff()
  const { data: financials } = useFinancials()

  if (!project) {
    return (
      <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
        This project doesn&apos;t exist or has been removed.
      </p>
    )
  }

  const finances = financials.projects.find(
    (item) => item.projectId === project.id
  )
  const assignedStaff = staff.filter(
    (member) => member.projectId === project.id
  ).length
  const meta = [
    project.phase,
    project.contractType,
    project.location,
    project.manager && `Manager: ${project.manager}`,
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
        <StatCard value={assignedStaff} label="Assigned staff" />
        <StatCard
          value={formatCurrency(finances?.clientPaid ?? 0)}
          label="Client receipts"
        />
        <StatCard
          value={
            finances?.budgetRemaining == null
              ? "—"
              : formatCurrency(finances.budgetRemaining)
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
          <ProjectInstructionsTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="store">
          <ProjectStoreTab project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
