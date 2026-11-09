import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type AttentionItem = {
  count: number
  /** Text after the count when it is 1, e.g. "activity is overdue." */
  one: string
  /** Text after the count otherwise, e.g. "activities are overdue." */
  other: string
}

type AttentionCardProps = {
  title: string
  items: AttentionItem[]
}

export function AttentionCard({ title, items }: AttentionCardProps) {
  const activeItems = items.filter((item) => item.count > 0)

  return (
    <Card className="rounded-2xl">
      <CardHeader className="px-5">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        {activeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing needs your attention right now.
          </p>
        ) : (
          <ul className="flex flex-col gap-3 text-sm leading-relaxed">
            {activeItems.map((item) => (
              <li key={item.other}>
                <span className="font-bold tabular-nums">{item.count}</span>{" "}
                {item.count === 1 ? item.one : item.other}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
