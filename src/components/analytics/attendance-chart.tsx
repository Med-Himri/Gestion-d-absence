"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { day: "Lun", present: 1180, absent: 40, late: 20 },
  { day: "Mar", present: 1150, absent: 60, late: 30 },
  { day: "Mer", present: 1200, absent: 30, late: 10 },
  { day: "Jeu", present: 1190, absent: 35, late: 25 },
  { day: "Ven", present: 1160, absent: 55, late: 25 },
]

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendance d'Assiduité - Cette Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="present"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              dot={{ fill: "var(--color-destructive)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
