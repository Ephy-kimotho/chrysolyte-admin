import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type OfficeTaskProgressProps = {
  task: string
  progress: number
  className?: string
}

export function OfficeTaskProgress({
  task,
  progress,
  className,
}: OfficeTaskProgressProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Progress
        value={progress}
        aria-label={`${task} progress`}
        className="h-1.5 flex-1 [&>[data-slot=progress-indicator]]:bg-chart-1"
      />
      <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
        {progress}%
      </span>
    </div>
  )
}
