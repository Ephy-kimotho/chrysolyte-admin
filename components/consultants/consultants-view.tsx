"use client"

import { SiteInstructionsTable } from "@/components/consultants/site-instructions-table"
import { PageBanner } from "@/components/page-banner"
import { useSiteInstructions } from "@/hooks/use-site-instructions"

export function ConsultantsView() {
  const { data: instructions } = useSiteInstructions()

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="Project Consultants Portal"
        description="Architects, engineers and quantity surveyors can review assigned project status and record trackable site instructions."
      />
      <SiteInstructionsTable instructions={instructions} />
    </div>
  )
}
