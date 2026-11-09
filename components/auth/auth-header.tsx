export function AuthHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8 space-y-2">
      <h2 className="font-heading text-2xl font-semibold text-heading">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
