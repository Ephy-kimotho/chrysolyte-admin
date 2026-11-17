import type { z } from "zod"

import type {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth"

export type LoginFormValues = z.infer<typeof loginSchema>

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export type OtpRequestFormValues = z.infer<typeof otpRequestSchema>

export type OtpVerifyFormValues = z.infer<typeof otpVerifySchema>

export interface OtpRequestResponse {
  message: string
  expires_in_seconds: number
}

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

/** `GET /auth/me` for a staff account (password sign-in). */
export interface StaffUser {
  user_id: string
  username: string
  email: string
  full_name: string
  role: string
  active: boolean
  must_change_password: boolean
  last_login_at: string
  failed_login_attempts: number
  locked_until: string | null
  is_locked: boolean
  created_at: string
  updated_at: string
}

/** `GET /auth/me` for a client account (email code sign-in). */
export interface ClientUser {
  subject_type: "client"
  client_id: string
  /** The company, e.g. "Acme Developers LTD". */
  name: string
  /** The person signed in for the company. */
  contact_name: string
  email: string
  phone: string
  // Item shape not confirmed yet; nothing reads it so far.
  projects: unknown[]
}

export type AuthUser = StaffUser | ClientUser

export function isClientUser(user: AuthUser): user is ClientUser {
  return "subject_type" in user && user.subject_type === "client"
}
