import { axiosInstance } from "@/lib/axios"
import {
  contractTypeApiValues,
  contractTypes,
  projectPhases,
  type CreateProjectFormValues,
  type CreateProjectPayload,
  type Project,
  type ProjectPhase,
  type ProjectResponse,
} from "@/lib/types/projects"

/**
 * Matches the division case-insensitively. Every project belongs to Design or
 * Construction, so anything else is treated as Construction.
 */
function toPhase(division: string): ProjectPhase {
  const lower = division.toLowerCase()
  return (
    projectPhases.find((phase) => phase.toLowerCase() === lower) ??
    "Construction"
  )
}

/** Turns `DesignOnly` into `Design Only`; an unknown value passes through. */
function toContractType(contract: string) {
  return (
    contractTypes.find((type) => contractTypeApiValues[type] === contract) ??
    contract
  )
}

function toProject(project: ProjectResponse): Project {
  return {
    id: project.project_id,
    code: project.project_id,
    name: project.name,
    phase: toPhase(project.division),
    contractType: toContractType(project.contract),
    budget: project.budget,
    location: project.location,
    progress: project.progress,
    status: project.status,
    startDate: project.start_date,
    dueDate: project.deadline,
    coverImageUrl: project.photo_url,
    client: project.client,
    clientId: project.client_id,
    supervisorId: project.supervisor_id,
    projectManagerId: project.pm_id,
    leadConsultantId: project.lead_consultant_id,
    clientNote: project.client_note,
    internalNote: project.internal_note,
  }
}

export async function listProjects() {
  const response =
    await axiosInstance.get<ProjectResponse[]>("/projects/projects")
  return response.data.map(toProject)
}

/** Adds `value` under `key` only when it isn't empty. */
function optional<K extends string>(key: K, value: string) {
  return (value ? { [key]: value } : {}) as Partial<Record<K, string>>
}

export async function createProject(values: CreateProjectFormValues) {
  const payload: CreateProjectPayload = {
    project_id: values.projectCode,
    name: values.name,
    division: values.phase,
    client: values.client,
    client_id: values.clientId,
    contract: contractTypeApiValues[values.contractType],
    location: values.location,
    start_date: values.startDate,
    deadline: values.dueDate,
    budget: values.budget,
    ...optional("supervisor_id", values.supervisorId),
    ...optional("pm_id", values.projectManagerId),
    ...optional("lead_consultant_id", values.leadConsultantId),
    ...optional("client_note", values.clientNote),
    ...optional("internal_note", values.internalNote),
  }

  const response = await axiosInstance.post("/projects/projects", payload)
  return response.data
}

/** Uploads a project's cover photo, replacing any it had. */
export async function uploadProjectPhoto(projectId: string, photo: File) {
  const body = new FormData()
  body.append("file", photo)

  // Axios sets the multipart Content-Type, boundary included, for FormData.
  const response = await axiosInstance.post(
    `/projects/projects/${encodeURIComponent(projectId)}/photo`,
    body
  )
  return response.data
}

export async function deleteProjectPhoto(projectId: string) {
  await axiosInstance.delete(
    `/projects/projects/${encodeURIComponent(projectId)}/photo`
  )
}
