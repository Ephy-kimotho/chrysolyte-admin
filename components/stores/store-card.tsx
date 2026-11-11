import { cn } from "@/lib/utils"

/** Header cell styling shared by the store tables. */
export const storeHeadClassName =
  "h-11 px-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

/** Body cell styling shared by the store tables. */
export const storeCellClassName = "px-2.5 py-3 whitespace-normal"

/** Small "+ …" button styling for adding to a store. */
export const storeAddButtonClassName =
  "h-8 rounded-xl px-3 text-xs font-semibold"

type StoreCardProps = {
  titleId: string
  title: string
  /** The store's add button. */
  action: React.ReactNode
  className?: string
  children: React.ReactNode
}

/** A titled store card. Tables inside scroll sideways on narrow screens. */
export function StoreCard({
  titleId,
  title,
  action,
  className,
  children,
}: StoreCardProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id={titleId}
          className="font-heading text-xl font-bold text-heading"
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}
