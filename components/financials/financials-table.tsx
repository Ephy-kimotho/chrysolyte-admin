import { cn } from "@/lib/utils"

/** Header cell styling shared by the financials tables. */
export const financialsHeadClassName =
  "h-11 px-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

/** Body cell styling shared by the financials tables. */
export const financialsCellClassName =
  "px-2.5 py-3.5 align-top whitespace-normal"

/**
 * A titled card holding a table. On narrow screens the table keeps its columns
 * and scrolls sideways instead of squashing.
 */
export function FinancialsTableCard({
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
