/**
 * The staff that the wages and site-instruction mocks refer to by id. The
 * Staff & KPI pages use the real API (`lib/api/staff.ts`); this goes once the
 * wages and site-instruction APIs replace their mocks.
 */
type MockStaffMember = {
  id: string
  fullName: string
  /** Daily rate in Kenyan shillings. */
  dailyRate: number
}

const staff: MockStaffMember[] = [
  { id: "peter-mwangi", fullName: "Peter Mwangi", dailyRate: 2500 },
  { id: "james-kamau", fullName: "James Kamau", dailyRate: 2200 },
  { id: "faith-njeri", fullName: "Faith Njeri", dailyRate: 4500 },
  { id: "anne-wambui", fullName: "Anne Wambui", dailyRate: 6000 },
  { id: "brian-otieno", fullName: "Brian Otieno", dailyRate: 1800 },
]

export function getStaffSnapshot() {
  return staff
}
