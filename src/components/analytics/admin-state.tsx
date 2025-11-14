"use client"

import { StatCard } from "@/components/analytics/stat-card"
import { Users, BookOpen, AlertCircle, TrendingUp } from "lucide-react"

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total Enseignants" value="24" icon={Users} trend="2 cette semaine" trendUp />
      <StatCard label="Total Étudiants" value="1,240" icon={BookOpen} trend="15 nouveaux" trendUp />
      <StatCard label="Absences Aujourd'hui" value="42" icon={AlertCircle} trend="12% du total" trendUp={false} />
      <StatCard label="Taux d'Assiduité" value="94.2%" icon={TrendingUp} trend="0.5% d'amélioration" trendUp />
    </div>
  )
}
