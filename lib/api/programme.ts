import { axiosInstance } from "@/lib/axios"
import type {
  CreateMilestoneFormValues,
  CreateMilestonePayload,
  Milestone,
  MilestoneResponse,
} from "@/lib/types/programme"

function milestonesPath(projectId: string) {
  return `/projects/projects/${encodeURIComponent(projectId)}/milestones`
}

function toMilestone(milestone: MilestoneResponse): Milestone {
  return {
    id: milestone.milestone_id,
    projectId: milestone.project_id,
    name: milestone.name,
    weight: milestone.weight,
    progress: milestone.progress,
    startDate: milestone.start_date,
    deadline: milestone.deadline,
    owner: milestone.owner,
  }
}

/** A project's milestones, earliest start first. */
export async function listMilestones(projectId: string) {
  const response = await axiosInstance.get<MilestoneResponse[]>(
    milestonesPath(projectId)
  )
  return response.data
    .map(toMilestone)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/** Adds a milestone to a project. */
export async function createMilestone(
  projectId: string,
  values: CreateMilestoneFormValues
) {
  const payload: CreateMilestonePayload = {
    name: values.name,
    weight: values.weight,
    progress: values.progress,
    start_date: values.startDate,
    deadline: values.deadline,
    owner: values.owner,
  }

  const response = await axiosInstance.post(milestonesPath(projectId), payload)
  return response.data
}

/**
 * Sets a milestone's completion. The API takes the whole milestone, so its
 * other details are sent unchanged.
 */
export async function updateMilestoneProgress(
  milestone: Milestone,
  progress: number
) {
  const payload: CreateMilestonePayload = {
    name: milestone.name,
    weight: milestone.weight,
    progress,
    start_date: milestone.startDate,
    deadline: milestone.deadline,
    owner: milestone.owner,
  }

  const response = await axiosInstance.patch(
    `/projects/milestones/${encodeURIComponent(milestone.id)}`,
    payload
  )
  return response.data
}

export async function deleteMilestone(milestoneId: string) {
  await axiosInstance.delete(
    `/projects/milestones/${encodeURIComponent(milestoneId)}`
  )
}
