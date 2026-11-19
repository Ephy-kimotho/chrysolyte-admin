import { axiosInstance } from "@/lib/axios"
import {
  newActivityStatus,
  type CreateMilestoneFormValues,
  type CreateMilestonePayload,
  type CreateProgrammeActivityFormValues,
  type CreateProgrammeActivityPayload,
  type Milestone,
  type MilestoneResponse,
  type ProgrammeActivity,
  type ProgrammeActivityResponse,
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

function activitiesPath(projectId: string) {
  return `/projects/projects/${encodeURIComponent(projectId)}/activities`
}

function toProgrammeActivity(
  activity: ProgrammeActivityResponse
): ProgrammeActivity {
  return {
    id: activity.activity_id,
    projectId: activity.project_id,
    milestoneId: activity.milestone_id,
    activity: activity.activity,
    owner: activity.owner,
    startDate: activity.start_date,
    deadline: activity.deadline,
    progress: activity.progress,
    status: activity.status,
    material: activity.material || null,
    forecastQuantity: activity.material ? activity.qty : null,
  }
}

/** A project's work programme activities, earliest deadline first. */
export async function listProgrammeActivities(projectId: string) {
  const response = await axiosInstance.get<ProgrammeActivityResponse[]>(
    activitiesPath(projectId)
  )
  return response.data
    .map(toProgrammeActivity)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

/** Adds an activity to a project's work programme. New ones start Active. */
export async function createProgrammeActivity(
  projectId: string,
  values: CreateProgrammeActivityFormValues
) {
  const payload: CreateProgrammeActivityPayload = {
    milestone_id: values.milestoneId,
    activity: values.activity,
    owner: values.owner,
    start_date: values.startDate,
    deadline: values.deadline,
    progress: values.progress,
    status: newActivityStatus,
    // The schema only lets a material through with its quantity.
    ...(values.material &&
      values.forecastQuantity !== null && {
        material: values.material,
        qty: values.forecastQuantity,
      }),
  }

  const response = await axiosInstance.post(activitiesPath(projectId), payload)
  return response.data
}

/**
 * Sets an activity's completion. The API takes the whole activity, so its
 * other details are sent unchanged.
 */
export async function updateActivityProgress(
  activity: ProgrammeActivity,
  progress: number
) {
  const payload: CreateProgrammeActivityPayload = {
    milestone_id: activity.milestoneId,
    activity: activity.activity,
    owner: activity.owner,
    start_date: activity.startDate,
    deadline: activity.deadline,
    progress,
    status: activity.status,
    ...(activity.material &&
      activity.forecastQuantity !== null && {
        material: activity.material,
        qty: activity.forecastQuantity,
      }),
  }

  const response = await axiosInstance.patch(
    `/projects/activities/${encodeURIComponent(activity.id)}`,
    payload
  )
  return response.data
}

export async function deleteActivity(activityId: string) {
  await axiosInstance.delete(
    `/projects/activities/${encodeURIComponent(activityId)}`
  )
}
