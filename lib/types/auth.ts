import type { z } from "zod"

import type {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth"

export type LoginFormValues = z.infer<typeof loginSchema>

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export interface AuthUser {
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
