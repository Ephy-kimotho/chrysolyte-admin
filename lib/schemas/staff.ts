import { z } from "zod"

import { imageFileSchema } from "@/lib/schemas/files"
import { invalidPhoneMessage, kenyanPhonePattern } from "@/lib/schemas/phone"
import { staffDivisions, staffHealthStatuses } from "@/lib/types/staff"

export const createStaffMemberSchema = z.object({
  /** Optional; initials show until a photo is added. */
  photo: imageFileSchema.nullable(),
  staffNumber: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "Enter a staff number")
    .max(20, "Keep the staff number under 20 characters"),
  fullName: z.string().trim().min(1, "Enter the staff member's name"),
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
  division: z.enum(staffDivisions, "Choose a division"),
  role: z.string().trim().min(1, "Enter the role"),
  dailyRate: z
    .number("Enter the daily rate in KES")
    .int("Use whole shillings")
    .positive("The daily rate must be more than 0"),
  qualification: z.string().trim().min(1, "Enter a qualification"),
  /** Comma-separated, e.g. "Site supervision, QA/QC, safety". */
  competences: z.string().trim(),
  projectId: z.string().nullable(),
  health: z.enum(staffHealthStatuses, "Choose a health status"),
})
