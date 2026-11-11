import type { Metadata } from "next"

import { AnnouncementsView } from "@/components/announcements/announcements-view"

export const metadata: Metadata = {
  title: "Announcements · Chrysolyte FirmControl",
}

export default function AnnouncementsPage() {
  return <AnnouncementsView />
}
