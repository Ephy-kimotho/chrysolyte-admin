import { axiosInstance } from "@/lib/axios"
import {
  clientApprovalStatuses,
  designStages,
  newDesignDeliverableStatus,
  type DesignDeliverableFormValues,
  type CreateDesignDeliverablePayload,
  type DesignDeliverable,
  type DesignDeliverableResponse,
} from "@/lib/types/design"
import { instructionDisciplines } from "@/lib/types/projects"

function designPath(projectId: string) {
  return `/projects/projects/${encodeURIComponent(projectId)}/design`
}

/**
 * Matches `value` to one of `known` case-insensitively, so `architecture`
 * shows as `Architecture`. An unknown value passes through.
 */
function toKnown(known: readonly string[], value: string) {
  const lower = value.toLowerCase()
  return known.find((item) => item.toLowerCase() === lower) ?? value
}

function toDesignDeliverable(
  deliverable: DesignDeliverableResponse
): DesignDeliverable {
  return {
    id: deliverable.design_id,
    projectId: deliverable.project_id,
    discipline: toKnown(instructionDisciplines, deliverable.discipline),
    stage: toKnown(designStages, deliverable.stage),
    deliverable: deliverable.deliverable,
    leadId: deliverable.lead_id,
    reviewerId: deliverable.reviewer_id,
    deadline: deliverable.deadline,
    progress: deliverable.progress,
    status: deliverable.status,
    clientApproval: toKnown(
      clientApprovalStatuses,
      deliverable.client_approval
    ),
  }
}

/** A project's design deliverables, soonest deadline first. */
export async function listDesignDeliverables(projectId: string) {
  const response = await axiosInstance.get<DesignDeliverableResponse[]>(
    designPath(projectId)
  )
  return response.data
    .map(toDesignDeliverable)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

/** Adds a deliverable to a project. Client approval starts as pending. */
export async function createDesignDeliverable(
  values: DesignDeliverableFormValues
) {
  const payload: CreateDesignDeliverablePayload = {
    discipline: values.discipline,
    stage: values.stage,
    deliverable: values.deliverable,
    lead_id: values.leadId,
    deadline: values.deadline,
    progress: values.progress,
    status: newDesignDeliverableStatus,
    reviewer_id: values.reviewerId,
    client_approval: "Pending",
  }

  const response = await axiosInstance.post(
    designPath(values.projectId),
    payload
  )
  return response.data
}

function deliverablePath(designId: string) {
  return `/projects/design/${encodeURIComponent(designId)}`
}

/**
 * The approval to send from the form's checkbox. Ticking it approves;
 * unticking an approved deliverable puts it back to pending; leaving it
 * unticked keeps whatever the client said, e.g. `Rejected`.
 */
function toClientApproval(current: string, approved: boolean) {
  if (approved) return "Approved"
  return current === "Approved" ? "Pending" : current
}

/** Saves changes to a deliverable. Its status is sent unchanged. */
export async function updateDesignDeliverable(
  deliverable: Pick<DesignDeliverable, "id" | "status" | "clientApproval">,
  values: DesignDeliverableFormValues
) {
  const payload: CreateDesignDeliverablePayload = {
    discipline: values.discipline,
    stage: values.stage,
    deliverable: values.deliverable,
    lead_id: values.leadId,
    deadline: values.deadline,
    progress: values.progress,
    status: deliverable.status,
    reviewer_id: values.reviewerId,
    client_approval: toClientApproval(
      deliverable.clientApproval,
      values.clientApproved
    ),
  }

  const response = await axiosInstance.patch(
    deliverablePath(deliverable.id),
    payload
  )
  return response.data
}

export async function deleteDesignDeliverable(designId: string) {
  await axiosInstance.delete(deliverablePath(designId))
}
