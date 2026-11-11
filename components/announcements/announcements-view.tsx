"use client"

import { AnnouncementCard } from "@/components/announcements/announcement-card"
import { PublishAnnouncementDialog } from "@/components/announcements/publish-announcement-dialog"
import { useAnnouncements } from "@/hooks/use-announcements"

export function AnnouncementsView() {
  const { data: announcements } = useAnnouncements()

  return (
    <section
      aria-labelledby="company-announcements-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="company-announcements-heading"
            className="font-heading text-xl font-bold text-heading"
          >
            Company announcements
          </h2>
          <p className="text-sm text-muted-foreground">
            Visible to everyone in the company, newest first.
          </p>
        </div>
        <PublishAnnouncementDialog />
      </div>

      {announcements.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No announcements yet. Publish one to share it with the team.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <AnnouncementCard announcement={announcement} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
