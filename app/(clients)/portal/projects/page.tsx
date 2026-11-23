import type { Metadata } from "next"

import { PortalProjectsView } from "@/components/portal/portal-projects-view"

export const metadata: Metadata = {
  title: "Projects · Chrysolyte FirmControl",
}

export default function PortalProjectsPage() {
  return <PortalProjectsView />
}
