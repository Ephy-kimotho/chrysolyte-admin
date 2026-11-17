import { z } from "zod"

import { passwordSchema } from "@/lib/schemas/auth"
import { invalidPhoneMessage, kenyanPhonePattern } from "@/lib/schemas/phone"

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Enter the user's full name"),
  username: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters")
    .regex(/^\S+$/, "Usernames can't contain spaces"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter an email address")
    .pipe(z.email("Enter a valid email address, e.g. name@chrysolyte.co.ke")),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .min(1, "Enter a phone number")
        .regex(kenyanPhonePattern, invalidPhoneMessage)
    ),
  /** Role names in the order they were ticked; the first is the main role. */
  roles: z.array(z.string()).min(1, "Choose at least one role"),
  password: passwordSchema,
})
