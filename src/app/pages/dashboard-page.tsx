
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { AdminStats } from "@/components/analytics/admin-state"
import { AdminUsersTable } from "@/components/analytics/admin-users-table"
import { AttendanceChart } from "@/components/analytics/attendance-chart"

export default function DashboardPage() {
  return (
    <main className="flex  p-4 h-full">
      <div className=" w-full relative">
        <div className="bg-neutral-100 rounded-xl shadow p-6 dark:bg-neutral-800 absolute size-full overflow-auto" >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-muted-foreground">Vue d'ensemble du système et gestion des utilisateurs</p>
          </div>

          {/* Statistics */}
          <AdminStats />

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <AttendanceChart />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Alertes Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <p className="text-sm font-medium text-foreground">Taux d'absence élevé en 3B</p>
                      <p className="text-xs text-muted-foreground mt-1">15% aujourd'hui</p>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <p className="text-sm font-medium text-foreground">Synchronisation réussie</p>
                      <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Users Table */}
          <AdminUsersTable />
        </div>
      </div>
    </main>
  )
}
