import type { Metadata } from "next"

import { ConsultantsView } from "@/components/consultants/consultants-view"

export const metadata: Metadata = {
  title: "Project Consultants · Chrysolyte FirmControl",
}

export default function ProjectConsultantsPage() {
  return <ConsultantsView />
}
