"use client"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/api/errors"
import { cn } from "@/lib/utils"

type LoadErrorProps = {
  error: unknown
  /** Shown when the API doesn't give a reason, e.g. "We couldn't load the projects." */
  fallback: string
  onRetry: () => void
  /** True while the retry is in flight. */
  isRetrying: boolean
  className?: string
}

/** Stands in for content that failed to load, with a way to try again. */
export function LoadError({
  error,
  fallback,
  onRetry,
  isRetrying,
  className,
}: LoadErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center",
        className
      )}
    >
      <p className="text-sm text-destructive">
        {getErrorMessage(error, fallback)}
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={isRetrying}
        className="h-10 rounded-full px-5"
      >
        {isRetrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  )
}
