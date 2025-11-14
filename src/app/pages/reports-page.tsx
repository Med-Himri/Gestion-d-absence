import { AttendanceStatsDetail } from "@/components/analytics/attendance-stats-detail"
import { DetailedReports } from "@/components/analytics/detailed-reports"

export default function AdminReportsPage() {
    return (

        <main className="flex  p-4 h-full">
            <div className=" w-full relative">
                <div className="bg-neutral-100 rounded-xl shadow p-6 dark:bg-neutral-800 absolute size-full overflow-auto" >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Rapports Détaillés</h1>
                        <p className="text-muted-foreground">Analyses approfondies et statistiques d'assiduité</p>
                    </div>

                    {/* Statistics Charts */}
                    <div className="mb-8">
                        <AttendanceStatsDetail />
                    </div>

                    {/* Detailed Records */}
                    <DetailedReports />
                </div>
            </div>
        </main>
    )
}
