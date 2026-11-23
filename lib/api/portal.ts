import { isAxiosError } from "axios"

import { axiosInstance } from "@/lib/axios"
import type {
  Portal,
  PortalProject,
  PortalProjectDetails,
  PortalProjectDetailsResponse,
  PortalProjectResponse,
  PortalResponse,
} from "@/lib/types/portal"

function toPortalProject(project: PortalProjectResponse): PortalProject {
  return {
    id: project.project_id,
    name: project.name,
    status: project.status,
    deadline: project.deadline,
    photoUrl: project.photo_url || null,
    progress: project.progress,
    contractValue: project.contract_value,
    collected: project.collected,
    balance: project.balance,
  }
}

/** The signed-in client and their projects, soonest deadline first. */
export async function getPortal(): Promise<Portal> {
  const response = await axiosInstance.get<PortalResponse>(
    "/firmcontrol/portal/me"
  )
  const { client, projects } = response.data

  return {
    client: {
      id: client.client_id,
      name: client.name,
      contactName: client.contact_name,
      email: client.email,
      phone: client.phone,
    },
    projects: projects
      .map(toPortalProject)
      .sort((a, b) => a.deadline.localeCompare(b.deadline)),
  }
}

/**
 * One of the client's projects with its milestones and payments, or null when
 * it doesn't exist or isn't theirs.
 */
export async function getPortalProject(
  projectId: string
): Promise<PortalProjectDetails | null> {
  try {
    const response = await axiosInstance.get<PortalProjectDetailsResponse>(
      `/firmcontrol/portal/projects/${encodeURIComponent(projectId)}`
    )
    const { project, progress, milestones, approved_reports, payments } =
      response.data

    return {
      id: project.project_id,
      name: project.name,
      clientName: project.client,
      status: project.status,
      deadline: project.deadline,
      photoUrl: project.photo_url || null,
      clientNote: project.client_note?.trim() || null,
      progress,
      contractValue: payments.contract_value,
      collected: payments.total_collected,
      balance: payments.balance,
      // In the order they're due.
      milestones: milestones
        .map((milestone) => ({ ...milestone }))
        .sort((a, b) => a.deadline.localeCompare(b.deadline)),
      approvedReportCount: approved_reports.length,
      // Newest first.
      payments: payments.records
        .map((record) => ({
          date: record.transaction_date,
          description: record.description,
          amount: record.amount,
        }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined
    if (status === 403 || status === 404) return null
    throw error
  }
}
