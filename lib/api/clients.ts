import { axiosInstance } from "@/lib/axios"
import type {
  Client,
  ClientResponse,
  CreateClientFormValues,
  CreateClientPayload,
  UpdateClientFormValues,
  UpdateClientPayload,
} from "@/lib/types/clients"

function toClient(client: ClientResponse): Client {
  return {
    id: client.client_id,
    name: client.name,
    contactName: client.contact_name,
    email: client.email,
    phone: client.phone,
    active: client.active,
    projectCount: client.project_count,
    createdAt: client.created_at,
    updatedAt: client.updated_at,
  }
}

/** Lists clients, filtered by `search` when it's given. */
export async function listClients(search?: string) {
  const response = await axiosInstance.get<ClientResponse[]>(
    "/projects/clients",
    { params: search ? { search } : undefined }
  )
  return response.data.map(toClient)
}

// New clients always start active; the form doesn't ask.
export async function createClient(values: CreateClientFormValues) {
  const payload: CreateClientPayload = {
    name: values.name,
    contact_name: values.contactName,
    email: values.email,
    phone: values.phone,
    active: true,
  }

  const response = await axiosInstance.post("/projects/clients", payload)
  return response.data
}

export async function updateClient(id: string, values: UpdateClientFormValues) {
  const payload: UpdateClientPayload = {
    name: values.name,
    contact_name: values.contactName,
    email: values.email,
    phone: values.phone,
  }

  const response = await axiosInstance.patch(`/projects/clients/${id}`, payload)
  return response.data
}

export async function deleteClient(id: string) {
  await axiosInstance.delete(`/projects/clients/${id}`)
}
