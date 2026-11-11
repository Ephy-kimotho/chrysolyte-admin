import { getProjectsSnapshot } from "@/lib/mock/projects"
import type {
  CreateDesignDeliverableFormValues,
  DesignDeliverable,
} from "@/lib/types/design"

type StoredDesignDeliverable = Omit<DesignDeliverable, "projectName">

// In-memory stand-in for a design deliverables API. Changes last until the page reloads.
let deliverables: StoredDesignDeliverable[] = [
  {
    id: "malaba-design-flats",
    projectId: "malaba-suites",
    discipline: "design",
    stage: "started",
    deliverable: "design flats",
    lead: "Irene Kamau",
    deadline: "2026-05-08",
    progress: 0,
    clientApproval: "Pending",
  },
]

export function getDesignDeliverablesSnapshot(): DesignDeliverable[] {
  const projects = getProjectsSnapshot()

  return deliverables.map((item) => ({
    ...item,
    projectName:
      projects.find((project) => project.id === item.projectId)?.name ??
      "Removed project",
  }))
}

export async function listDesignDeliverables() {
  return getDesignDeliverablesSnapshot()
}

export async function createDesignDeliverable(
  data: CreateDesignDeliverableFormValues
) {
  const deliverable: StoredDesignDeliverable = {
    id: crypto.randomUUID(),
    ...data,
    // The client reviews it later.
    clientApproval: "Pending",
  }
  deliverables = [...deliverables, deliverable]
  return deliverable
}
