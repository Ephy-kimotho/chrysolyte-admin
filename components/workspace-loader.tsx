import { Loader2 } from "lucide-react"

function WorkspaceLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_top_left,var(--sidebar-gradient-from),var(--background)_55%,var(--sidebar-gradient-to))] px-4"
    >
      <Loader2
        aria-hidden="true"
        className="size-10 animate-spin text-primary"
      />
      <p className="text-sm font-medium text-muted-foreground">
        Loading your workspace
      </p>
    </div>
  )
}

export { WorkspaceLoader }
