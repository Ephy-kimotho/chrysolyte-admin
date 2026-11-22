import { isValid, parseISO } from "date-fns"
import { z } from "zod"

import { imageFileSchema } from "@/lib/schemas/files"
import { invalidPhoneMessage, kenyanPhonePattern } from "@/lib/schemas/phone"
import {
  emergencyContactRelationships,
  staffDivisions,
  staffEmploymentTypes,
  staffHealthStatuses,
} from "@/lib/types/staff"

const isValidIsoDate = (value: string) => isValid(parseISO(value))

// The fields the add and update forms share. The photo is handled on its own.
export const staffDetailsShape = z.object({
  fullName: z.string().trim().min(1, "Enter the staff member's name"),
  idNo: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "Enter an ID number")
    .max(20, "Keep the ID number under 20 characters"),
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
  employmentType: z.enum(staffEmploymentTypes, "Choose an employment type"),
  startDate: z
    .string()
    .min(1, "Choose the start date")
    .refine(isValidIsoDate, "Enter a valid date"),
  dailyRate: z
    .number("Enter the daily rate in KES")
    .int("Use whole shillings")
    .positive("The daily rate must be more than 0"),
  health: z.enum(staffHealthStatuses, "Choose a health status"),
  /** Only asked for, and only sent, when the health status isn't Fit. */
  returnToWork: z.string(),
})

function checkReturnToWork(
  values: { health: string; returnToWork: string },
  ctx: z.RefinementCtx
) {
  if (values.health === "Fit") return
  if (!values.returnToWork) {
    ctx.addIssue({
      code: "custom",
      path: ["returnToWork"],
      message: "Choose when they return to work",
    })
  } else if (!isValidIsoDate(values.returnToWork)) {
    ctx.addIssue({
      code: "custom",
      path: ["returnToWork"],
      message: "Enter a valid date",
    })
  }
}

export const createStaffMemberSchema = staffDetailsShape
  .extend({
    /**
     * Optional; initials show until a photo is added. It isn't part of the
     * create payload: it's uploaded separately once the staff member exists.
     */
    photo: imageFileSchema.nullable(),
  })
  .superRefine(checkReturnToWork)

// The ID number can't be changed after the staff member is added.
export const updateStaffMemberSchema = staffDetailsShape
  .omit({ idNo: true })
  .extend({
    /** False blocks them from signing in to their account. */
    isActive: z.boolean(),
  })
  .superRefine(checkReturnToWork)

export const createEmergencyContactSchema = z.object({
  name: z.string().trim().min(1, "Enter the contact's name"),
  relationship: z.enum(
    emergencyContactRelationships,
    "Choose how they're related"
  ),
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
})

export const uploadStaffPhotoSchema = z.object({
  // Null until a photo is chosen, so the field can start empty.
  photo: imageFileSchema
    .nullable()
    .refine((photo) => photo !== null, "Choose a photo to upload"),
})

export const createStaffSkillSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Enter a category")
    .max(15, "Keep the category to 15 characters"),
  skill: z
    .string()
    .trim()
    .min(1, "Enter the skill")
    .max(50, "Keep the skill to 50 characters"),
  /** Optional. */
  description: z
    .string()
    .trim()
    .max(100, "Keep the description to 100 characters"),
})

const isoDateSchema = (label: string) =>
  z
    .string()
    .min(1, `Choose the ${label}`)
    .refine(isValidIsoDate, "Enter a valid date")

export const assignProjectSchema = z
  .object({
    projectId: z.string("Choose a project").min(1, "Choose a project"),
    assignedFrom: isoDateSchema("start date"),
    assignedTo: isoDateSchema("end date"),
  })
  .refine((values) => values.assignedTo >= values.assignedFrom, {
    // ISO dates compare correctly as text.
    message: "The end date can't be before the start date",
    path: ["assignedTo"],
  })
