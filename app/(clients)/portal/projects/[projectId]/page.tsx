import type { Metadata } from "next"

import { PortalProjectDetailsView } from "@/components/portal/portal-project-details-view"

export const metadata: Metadata = {
  title: "Project · Chrysolyte FirmControl",
}

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  return <PortalProjectDetailsView projectId={projectId} />
}
