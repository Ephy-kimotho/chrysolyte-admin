import type { z } from "zod"

import type { createUserSchema } from "@/lib/schemas/users"

/** `GET /auth/users/stats` */
export interface UserStatsResponse {
  total_users: number
  active_users: number
  inactive_users: number
  /** User count per role slug, e.g. `{ "projectmanager": 2 }`. */
  by_role: Record<string, number>
}

export interface RoleCount {
  role: string
  count: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  byRole: RoleCount[]
}

/** An item from `GET /auth/roles`. */
export interface RoleResponse {
  name: string
  label: string
  description: string
  is_project_scoped: boolean
  is_system_default: boolean
  is_active: boolean
  permission_count: number
  user_count: number
  created_at: string
}

export interface Role {
  /** Sent to the API, e.g. "accountant". */
  name: string
  /** Shown to people, e.g. "Accountant (CFO)". */
  label: string
  description: string
  isProjectScoped: boolean
  isActive: boolean
}

export type CreateUserFormValues = z.infer<typeof createUserSchema>

/** `POST /auth/users` */
export interface CreateUserPayload {
  username: string
  email: string
  phone: string
  full_name: string
  password: string
  role: string
  roles: string[]
  project_id: string
  project_ids: string[]
  must_change_password: boolean
}

/** An item from `GET /auth/users`. */
export interface UserResponse {
  user_id: string
  username: string
  email: string
  phone: string | null
  full_name: string
  role: string
  roles: string[]
  project_id: string | null
  project_ids: string[]
  active: boolean
  must_change_password: boolean
  last_login_at: string | null
  failed_login_attempts: number
  locked_until: string | null
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  username: string
  email: string
  phone: string | null
  fullName: string
  roles: string[]
  /** Empty for firm-wide users, who can see every project. */
  projectIds: string[]
  active: boolean
  isLocked: boolean
  /** When a lock from failed sign-ins ends; null when not locked that way. */
  lockedUntil: string | null
  lastLoginAt: string | null
  createdAt: string
}
