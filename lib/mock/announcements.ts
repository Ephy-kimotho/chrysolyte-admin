import type {
  Announcement,
  PublishAnnouncementFormValues,
} from "@/lib/types/announcements"

// In-memory stand-in for an announcements API. Changes last until the page
// reloads. Kept newest first.
let announcements: Announcement[] = [
  {
    id: "public-holiday-15-nov",
    title: "Public holiday on 15 November",
    body: "Offices and sites will be closed on Sunday, 15 November for the public holiday. Site supervisors, please confirm that all sites are secured by Saturday evening.",
    author: "CEO",
    publishedAt: "2026-11-11T07:45:00+03:00",
  },
  {
    id: "safety-induction-kilimani",
    title: "Safety induction for Kilimani Residence",
    body: "All new site staff joining Kilimani Residence must complete the safety induction before starting work.\n\nInductions run every Monday at 8:00 AM at the site office.",
    author: "CEO",
    publishedAt: "2026-10-28T09:10:00+03:00",
  },
  {
    id: "q3-review",
    title: "Q3 performance review",
    body: "Thank you all for a strong quarter. Department heads, please submit your Q3 KPI summaries by the end of the week.",
    author: "CEO",
    publishedAt: "2026-08-06T10:30:00+03:00",
  },
]

/** The current announcements, synchronously, for seeding the query cache. */
export function getAnnouncementsSnapshot() {
  return announcements
}

export async function listAnnouncements() {
  return announcements
}

export async function publishAnnouncement(
  data: PublishAnnouncementFormValues,
  author: string
) {
  const announcement: Announcement = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    body: data.body.trim(),
    author,
    publishedAt: new Date().toISOString(),
  }
  announcements = [announcement, ...announcements]
  return announcement
}

export async function removeAnnouncement(id: string) {
  announcements = announcements.filter((item) => item.id !== id)
}
