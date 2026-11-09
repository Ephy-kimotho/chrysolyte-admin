import { z } from "zod"

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .pipe(z.email("Enter a valid email address"))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Enter a new password")
      .min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
