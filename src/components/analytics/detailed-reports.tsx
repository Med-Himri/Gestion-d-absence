"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface AbsenceRecord {
  id: string
  studentName: string
  class: string
  date: string
  type: "absent" | "late"
  reason?: string
  justified: boolean
}

const mockRecords: AbsenceRecord[] = [
  {
    id: "1",
    studentName: "Ahmed Ben Ali",
    class: "3A",
    date: "2025-11-13",
    type: "absent",
    reason: "Maladie",
    justified: true,
  },
  {
    id: "2",
    studentName: "Mohamed Saadi",
    class: "3B",
    date: "2025-11-13",
    type: "absent",
    reason: "Non spécifié",
    justified: false,
  },
  {
    id: "3",
    studentName: "Karim Hassen",
    class: "2C",
    date: "2025-11-12",
    type: "late",
    reason: "Problème de transport",
    justified: true,
  },
  {
    id: "4",
    studentName: "Leila Mansour",
    class: "3A",
    date: "2025-11-11",
    type: "absent",
    reason: "Événement scolaire",
    justified: true,
  },
  {
    id: "5",
    studentName: "Noor Amira",
    class: "2A",
    date: "2025-11-10",
    type: "late",
    reason: "Absence justifiée",
    justified: true,
  },
]

export function DetailedReports() {
  const [records] = useState<AbsenceRecord[]>(mockRecords)
  const [filterType, setFilterType] = useState<"all" | "absent" | "late">("all")

  const filteredRecords = filterType === "all" ? records : records.filter((r) => r.type === filterType)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rapports d'Absences Détaillés</CardTitle>
        <Button size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-2 mb-6 pb-4 border-b border-border">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
            Toutes
          </Button>
          <Button
            variant={filterType === "absent" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("absent")}
          >
            Absences
          </Button>
          <Button
            variant={filterType === "late" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("late")}
          >
            Retards
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Étudiant</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Classe</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Raison</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">État</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium text-foreground">{record.studentName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{record.class}</td>
                  <td className="py-3 px-4 text-muted-foreground">{record.date}</td>
                  <td className="py-3 px-4">
                    <Badge variant={record.type === "absent" ? "destructive" : "secondary"}>
                      {record.type === "absent" ? "Absent" : "Retard"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">{record.reason || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        record.justified
                          ? "bg-green-500/10 text-green-700 border border-green-500/20"
                          : "bg-orange-500/10 text-orange-700 border border-orange-500/20"
                      }
                    >
                      {record.justified ? "Justifiée" : "Non justifiée"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {filteredRecords.filter((r) => r.justified).length}
            </div>
            <div className="text-xs text-muted-foreground">Justifiées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {filteredRecords.filter((r) => !r.justified).length}
            </div>
            <div className="text-xs text-muted-foreground">Non justifiées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{filteredRecords.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
