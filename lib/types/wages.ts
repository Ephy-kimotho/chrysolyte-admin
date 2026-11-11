export const wageStatuses = ["Due Friday", "Paid"] as const

export type WageStatus = (typeof wageStatuses)[number]

/** One worker's wages for a Sunday-to-Friday week. Amounts are in KES. */
export type WageProjection = {
  id: string
  projectId: string
  staffId: string
  workerName: string
  /** ISO date (yyyy-MM-dd) of the Sunday the week starts on. */
  weekStart: string
  daysWorked: number
  dailyRate: number
  /** Days worked × daily rate. */
  gross: number
  /** Paid early, deducted from the gross. */
  advance: number
  /** Gross minus advance. */
  net: number
  status: WageStatus
}
