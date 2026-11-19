import { isValid, parseISO } from "date-fns"
import { z } from "zod"

const isoDateSchema = (label: string) =>
  z
    .string()
    .min(1, `Choose the ${label}`)
    .refine((value) => isValid(parseISO(value)), "Enter a valid date")

const percentSchema = z
  .number("Enter a percentage from 0 to 100")
  .int("Use a whole number")
  .min(0, "It can't be below 0%")
  .max(100, "It can't be above 100%")

/** Longest milestone name, in characters. */
export const milestoneNameMaxLength = 50

/** Longest activity description, in characters. */
export const activityMaxLength = 50

/**
 * A new milestone. `remainingWeight` is the share of the project not yet given
 * to other milestones, so the weights never add up to more than 100%.
 */
export function createMilestoneSchema(remainingWeight: number) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Enter the milestone")
        .max(
          milestoneNameMaxLength,
          `Keep it to ${milestoneNameMaxLength} characters or fewer`
        ),
      owner: z.string().trim().min(1, "Enter who owns it"),
      weight: z
        .number("Enter the weight as a percentage")
        .int("Use a whole number")
        .min(1, "The weight must be at least 1%")
        .max(
          remainingWeight,
          remainingWeight === 0
            ? "All 100% of the weight is already allocated"
            : `Only ${remainingWeight}% of the weight is left`
        ),
      progress: percentSchema,
      startDate: isoDateSchema("start date"),
      deadline: isoDateSchema("deadline"),
    })
    .refine((values) => values.deadline >= values.startDate, {
      // ISO dates compare correctly as text.
      message: "The deadline can't be before the start date",
      path: ["deadline"],
    })
}

/** An inline progress update, for a milestone or an activity. */
export const progressUpdateSchema = z.object({
  progress: percentSchema,
})

export const createProgrammeActivitySchema = z
  .object({
    milestoneId: z.string().min(1, "Choose the milestone"),
    activity: z
      .string()
      .trim()
      .min(1, "Describe the activity")
      .max(
        activityMaxLength,
        `Keep it to ${activityMaxLength} characters or fewer`
      ),
    owner: z.string().trim().min(1, "Enter who owns it"),
    startDate: isoDateSchema("start date"),
    deadline: isoDateSchema("deadline"),
    progress: percentSchema,
    /** Optional, but needs a quantity when given. */
    material: z.string().trim(),
    forecastQuantity: z
      .number("Enter the forecast quantity")
      .positive("The quantity must be more than 0")
      .nullable(),
  })
  .refine((values) => values.deadline >= values.startDate, {
    // ISO dates compare correctly as text.
    message: "The deadline can't be before the start date",
    path: ["deadline"],
  })
  .refine((values) => !values.material || values.forecastQuantity !== null, {
    message: "Enter the forecast quantity",
    path: ["forecastQuantity"],
  })
  .refine((values) => values.material || values.forecastQuantity === null, {
    message: "Enter the material this quantity is for",
    path: ["material"],
  })
