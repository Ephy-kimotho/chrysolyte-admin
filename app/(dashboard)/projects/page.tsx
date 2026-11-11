import type { Metadata } from "next"

import { ProjectsView } from "@/components/projects/projects-view"

export const metadata: Metadata = {
  title: "Projects · Chrysolyte FirmControl",
}

export default function ProjectsPage() {
  return <ProjectsView />
}
