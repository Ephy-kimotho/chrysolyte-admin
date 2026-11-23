"use client"

import { AnnouncementCard } from "@/components/announcements/announcement-card"
import { PublishAnnouncementDialog } from "@/components/announcements/publish-announcement-dialog"
import { LoadError } from "@/components/load-error"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnnouncements } from "@/hooks/use-announcements"

export function AnnouncementsView() {
  const announcementsQuery = useAnnouncements()
  const announcements = announcementsQuery.data ?? []

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

      {announcementsQuery.isPending ? (
        <div aria-busy="true" className="flex flex-col gap-4">
          <p role="status" className="sr-only">
            Loading announcements…
          </p>
          {[0, 1].map((item) => (
            <Card key={item} className="gap-3 rounded-2xl p-4 sm:p-5">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full max-w-prose" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : announcementsQuery.isError ? (
        <LoadError
          error={announcementsQuery.error}
          fallback="We couldn't load the announcements."
          onRetry={() => announcementsQuery.refetch()}
          isRetrying={announcementsQuery.isFetching}
        />
      ) : announcements.length === 0 ? (
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
