import { loadSnapshots } from "@/lib/data-loader"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default function DashboardPage() {
  const timeSeries = loadSnapshots()

  return <DashboardClient snapshots={timeSeries.snapshots} />
}
