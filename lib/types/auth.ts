import type { z } from "zod"

import type {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/lib/schemas/auth"

export type LoginFormValues = z.infer<typeof loginSchema>

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
