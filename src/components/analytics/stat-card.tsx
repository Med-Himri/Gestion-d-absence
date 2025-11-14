import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
