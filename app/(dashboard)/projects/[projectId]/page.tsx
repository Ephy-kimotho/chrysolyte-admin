import type { Metadata } from "next"

import { ProjectDetailsView } from "@/components/projects/project-details-view"

export const metadata: Metadata = {
  title: "Project · Chrysolyte FirmControl",
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  return <ProjectDetailsView projectId={projectId} />
}
