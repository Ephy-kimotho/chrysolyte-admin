import { axiosInstance } from "@/lib/axios"
import { formatRole } from "@/lib/format"
import type {
  CreateUserFormValues,
  CreateUserPayload,
  Role,
  RoleResponse,
  User,
  UserResponse,
  UserStats,
  UserStatsResponse,
} from "@/lib/types/users"

function toUser(user: UserResponse): User {
  return {
    id: user.user_id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    fullName: user.full_name,
    // Older accounts may only have the single `role`.
    roles: user.roles.length > 0 ? user.roles : [user.role],
    projectIds: user.project_ids,
    active: user.active,
    isLocked: user.is_locked,
    lockedUntil: user.locked_until,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at,
  }
}

export async function listUsers() {
  const response = await axiosInstance.get<UserResponse[]>("/auth/users")
  return response.data.map(toUser)
}

/** User totals, with roles sorted by their display name. */
export async function getUserStats(): Promise<UserStats> {
  const response =
    await axiosInstance.get<UserStatsResponse>("/auth/users/stats")
  const stats = response.data

  return {
    totalUsers: stats.total_users,
    activeUsers: stats.active_users,
    inactiveUsers: stats.inactive_users,
    byRole: Object.entries(stats.by_role)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => formatRole(a.role).localeCompare(formatRole(b.role))),
  }
}

export async function listRoles(): Promise<Role[]> {
  const response = await axiosInstance.get<RoleResponse[]>("/auth/roles")
  return response.data.map((role) => ({
    name: role.name,
    label: role.label,
    description: role.description,
    isProjectScoped: role.is_project_scoped,
    isActive: role.is_active,
  }))
}

// New users are firm-wide (no project) and must replace the generated
// password the first time they sign in.
export async function createUser(values: CreateUserFormValues) {
  const payload: CreateUserPayload = {
    username: values.username,
    email: values.email,
    phone: values.phone,
    full_name: values.fullName,
    password: values.password,
    role: values.roles[0],
    roles: values.roles,
    project_id: "",
    project_ids: [],
    must_change_password: true,
  }

  const response = await axiosInstance.post("/auth/users", payload)
  return response.data
}

export async function disableUser(userId: string) {
  await axiosInstance.post(`/auth/users/${userId}/disable`)
}

export async function enableUser(userId: string) {
  await axiosInstance.post(`/auth/users/${userId}/enable`)
}

export async function unlockUser(userId: string) {
  await axiosInstance.post(`/auth/users/${userId}/unlock`)
}

export async function deleteUser(userId: string) {
  await axiosInstance.delete(`/auth/users/${userId}`)
}
