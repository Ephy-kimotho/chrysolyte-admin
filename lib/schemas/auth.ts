import { z } from "zod"

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .pipe(z.email("Enter a valid email address"))

/*
 * Every email and password is trimmed, so a space copied in by accident never
 * reaches the API. The resolver hands the form the parsed values, so the
 * trimmed ones are what get sent.
 */

export const passwordSchema = z
  .string()
  .trim()
  .regex(/[A-Z]/, "Password must have at least one uppercase letter")
  .regex(/[a-z]/, "Password must have at least one lowercase letter")
  .regex(/[0-9]/, "Password must have at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must have one special character")
  .min(8, "Password must be at least 8 characters")

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username or email."),
  password: z.string().trim().min(1, "Enter your password."),
})

export const forgotPasswordSchema = z.object({ email })

export const otpRequestSchema = z.object({ identifier: email })

export const otpVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().trim().min(1, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, "Enter your current password"),
    newPassword: passwordSchema,
    confirmPassword: z.string().trim().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "Choose a password different from your current one",
    path: ["newPassword"],
  })
