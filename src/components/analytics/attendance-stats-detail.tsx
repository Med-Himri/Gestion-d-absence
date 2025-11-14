"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const classAttendanceData = [
  { class: "3A", attendance: 96 },
  { class: "3B", attendance: 92 },
  { class: "2C", attendance: 94 },
  { class: "2A", attendance: 89 },
  { class: "1B", attendance: 98 },
]

const absenceReasonData = [
  { name: "Maladie", value: 35, fill: "var(--color-chart-1)" },
  { name: "Absence injustifiée", value: 28, fill: "var(--color-chart-2)" },
  { name: "Problème personnel", value: 22, fill: "var(--color-chart-3)" },
  { name: "Événement scolaire", value: 15, fill: "var(--color-chart-4)" },
]

export function AttendanceStatsDetail() {
  return (
    <div className="space-y-6">
      {/* Bar Chart - Attendance by Class */}
      <Card>
        <CardHeader>
          <CardTitle>Taux d'Assiduité par Classe</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="class" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="attendance" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Absence Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Raisons des Absences</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={absenceReasonData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {absenceReasonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
