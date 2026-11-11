import { cn } from "@/lib/utils"

/** Header cell styling for tables inside a `TableCard`. */
export const tableHeadClassName =
  "h-11 px-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

/** Body cell styling for tables inside a `TableCard`. */
export const tableCellClassName = "px-2.5 py-3.5 align-top whitespace-normal"

/** Small "+ …" button in a `TableCard` header. */
export const tableCardActionClassName =
  "h-8 rounded-xl px-3 text-xs font-semibold"

/**
 * A titled card holding a table. On narrow screens the table keeps its columns
 * and scrolls sideways instead of squashing.
 */
export function TableCard({
  titleId,
  title,
  titleClassName,
  action,
  children,
}: {
  titleId: string
  title: string
  titleClassName?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id={titleId}
          className={cn("font-heading font-bold", titleClassName)}
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
