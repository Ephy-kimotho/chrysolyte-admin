import type { Metadata } from "next"

import { StaffView } from "@/components/staff/staff-view"

export const metadata: Metadata = {
  title: "Staff & KPI · Chrysolyte FirmControl",
}

export default function StaffKpiPage() {
  return <StaffView />
}
