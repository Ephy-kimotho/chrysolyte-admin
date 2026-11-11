"use client"

import { DesignDeliverablesTable } from "@/components/design/design-deliverables-table"
import { PageBanner } from "@/components/page-banner"
import { useDesignDeliverables } from "@/hooks/use-design-deliverables"

export function DesignView() {
  const { data: deliverables } = useDesignDeliverables()

  return (
    <div className="flex flex-col gap-4">
      <PageBanner
        title="DESIGN PORTAL"
        description="Multi-project assignments, disciplines, deliverables, reviews, coordination and client approvals."
      />
      <DesignDeliverablesTable deliverables={deliverables} />
    </div>
  )
}
