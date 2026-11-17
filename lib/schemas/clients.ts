import { z } from "zod"

// Kenyan mobile numbers: 07XXXXXXXX, 01XXXXXXXX, or the +254 form.
const kenyanPhonePattern = /^(?:\+254|0)[17]\d{8}$/
const invalidPhoneMessage = "Enter a valid number, e.g. 0712 345 678"

const phoneDigitsSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ""))

export const createClientSchema = z.object({
  name: z.string().trim().min(1, "Enter the client's name"),
  contactName: z.string().trim().min(1, "Enter the contact person's name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter an email address")
    .pipe(z.email("Enter a valid email address, e.g. name@company.co.ke")),
  phone: phoneDigitsSchema.pipe(
    z
      .string()
      .min(1, "Enter a phone number")
      .regex(kenyanPhonePattern, invalidPhoneMessage)
  ),
})

// Existing clients may have no phone on record, so it's optional here and a
// blank field becomes null.
export const updateClientSchema = createClientSchema.extend({
  phone: phoneDigitsSchema
    .refine(
      (value) => value === "" || kenyanPhonePattern.test(value),
      invalidPhoneMessage
    )
    .transform((value) => value || null),
})
