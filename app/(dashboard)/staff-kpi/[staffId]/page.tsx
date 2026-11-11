import type { Metadata } from "next"

import { StaffProfileView } from "@/components/staff/staff-profile-view"

export const metadata: Metadata = {
  title: "Staff profile · Chrysolyte FirmControl",
}

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string }>
}) {
  const { staffId } = await params
  return <StaffProfileView staffId={staffId} />
}
