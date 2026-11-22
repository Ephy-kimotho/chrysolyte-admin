import { axiosInstance } from "@/lib/axios"
import {
  newOfficeTaskStatus,
  officeTaskCategories,
  type CreateOfficeTaskFormValues,
  type CreateOfficeTaskPayload,
  type OfficeTask,
  type OfficeTaskFilters,
  type OfficeTaskResponse,
  type UpdateOfficeTaskPayload,
} from "@/lib/types/coo-operations"

const officeWorkPath = "/projects/office-work"

/** Turns `finance` into `Finance`; an unknown category passes through. */
function toCategory(category: string) {
  const lower = category.toLowerCase()
  return (
    officeTaskCategories.find((known) => known.toLowerCase() === lower) ??
    category
  )
}

function toOfficeTask(task: OfficeTaskResponse): OfficeTask {
  return {
    id: task.work_id,
    projectId: task.project_id,
    category: toCategory(task.category),
    task: task.task,
    owner: task.owner,
    deadline: task.deadline,
    progress: task.progress,
    status: task.status,
    notes: task.notes || null,
  }
}

/** The office work log, narrowed by `filters`, soonest deadline first. */
export async function listOfficeTasks(filters: OfficeTaskFilters = {}) {
  const response = await axiosInstance.get<OfficeTaskResponse[]>(
    officeWorkPath,
    {
      // Axios leaves out the undefined ones.
      params: {
        project_id: filters.projectId,
        status: filters.status,
        category: filters.category,
      },
    }
  )
  return response.data
    .map(toOfficeTask)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

/** Adds a task to the office work log. New tasks start Active. */
export async function createOfficeTask(values: CreateOfficeTaskFormValues) {
  const payload: CreateOfficeTaskPayload = {
    project_id: values.projectId,
    category: values.category,
    task: values.task,
    owner: values.owner,
    deadline: values.deadline,
    progress: values.progress,
    status: newOfficeTaskStatus,
    notes: values.notes,
  }

  const response = await axiosInstance.post(officeWorkPath, payload)
  return response.data
}

function officeTaskPath(workId: string) {
  return `${officeWorkPath}/${encodeURIComponent(workId)}`
}

/**
 * Saves changes to a task. The project and status can't be changed here, so
 * they're sent as they are.
 */
export async function updateOfficeTask(
  task: Pick<OfficeTask, "id" | "projectId" | "status">,
  values: CreateOfficeTaskFormValues
) {
  const payload: UpdateOfficeTaskPayload = {
    project_id: task.projectId,
    category: values.category,
    task: values.task,
    owner: values.owner,
    deadline: values.deadline,
    progress: values.progress,
    status: task.status,
    notes: values.notes,
  }

  const response = await axiosInstance.patch(officeTaskPath(task.id), payload)
  return response.data
}

export async function deleteOfficeTask(workId: string) {
  await axiosInstance.delete(officeTaskPath(workId))
}
