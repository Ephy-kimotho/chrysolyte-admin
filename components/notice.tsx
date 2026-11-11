import { cn } from "@/lib/utils"

/** An amber callout for rules and caveats, e.g. who can record activities. */
export function Notice({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      className={cn(
        "rounded-xl border-l-4 border-warning bg-warning-muted/50 px-4 py-3 text-sm leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  )
}
