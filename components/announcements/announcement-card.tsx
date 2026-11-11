import { RemoveAnnouncementDialog } from "@/components/announcements/remove-announcement-dialog"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/format"
import type { Announcement } from "@/lib/types/announcements"

type AnnouncementCardProps = {
  announcement: Announcement
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="gap-3 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            <time dateTime={announcement.publishedAt}>
              {formatDate(announcement.publishedAt)}
            </time>{" "}
            · {announcement.author}
          </p>
          <h3 className="font-heading text-base font-bold text-balance break-words text-heading">
            {announcement.title}
          </h3>
        </div>
        {/* -mt/-mr pull the icon button into the corner without shifting the text. */}
        <div className="-mt-1.5 -mr-1.5 shrink-0">
          <RemoveAnnouncementDialog announcement={announcement} />
        </div>
      </div>

      <p className="max-w-prose leading-relaxed break-words whitespace-pre-line text-foreground/90">
        {announcement.body}
      </p>
    </Card>
  )
}
