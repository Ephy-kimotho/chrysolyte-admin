import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: string | number
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col gap-1 px-5 py-1">
        <p className="font-heading text-3xl font-bold text-heading tabular-nums">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
