"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { ServerType, Granularity, ChartDataPoint, Snapshot } from "@/lib/types"
import { aggregateByGranularity } from "@/lib/data-aggregator"

interface DashboardClientProps {
  snapshots: Snapshot[]
}

export function DashboardClient({ snapshots }: DashboardClientProps) {
  const [serverType, setServerType] = useState<ServerType>("all")
  const [granularity, setGranularity] = useState<Granularity>("daily")

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const aggregated = aggregateByGranularity(snapshots, granularity)

    return aggregated.map(snapshot => {
      const point: ChartDataPoint = {
        timestamp: new Date(snapshot.timestamp).toLocaleDateString(),
        total: snapshot.total,
        local: snapshot.local,
        remote: snapshot.remote
      }
      return point
    })
  }, [snapshots, granularity])

  const filteredData = useMemo(() => {
    if (serverType === "all") return chartData

    return chartData.map(point => ({
      ...point,
      total: serverType === "local" ? point.local : point.remote
    }))
  }, [chartData, serverType])

  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">MCP Registry Analytics</h1>
        <p className="text-gray-400 mt-2">
          Track the growth and distribution of Model Context Protocol servers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-400">Total Servers</div>
          <div className="text-3xl font-bold text-primary mt-2">
            {latestSnapshot?.total || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {snapshots.length} data points
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-400">Local Servers</div>
          <div className="text-3xl font-bold text-blue-500 mt-2">
            {latestSnapshot?.local || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {latestSnapshot ? Math.round((latestSnapshot.local / latestSnapshot.total) * 100) : 0}% of total
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-400">Remote Servers</div>
          <div className="text-3xl font-bold text-pink-500 mt-2">
            {latestSnapshot?.remote || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {latestSnapshot ? Math.round((latestSnapshot.remote / latestSnapshot.total) * 100) : 0}% of total
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Server Type</label>
              <Select value={serverType} onValueChange={(value) => setServerType(value as ServerType)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Servers</SelectItem>
                  <SelectItem value="local">Local Only</SelectItem>
                  <SelectItem value="remote">Remote Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Time Granularity</label>
              <div className="flex gap-2">
                <Button
                  variant={granularity === "hourly" ? "default" : "outline"}
                  onClick={() => setGranularity("hourly")}
                  className="text-xs px-3"
                >
                  Hourly
                </Button>
                <Button
                  variant={granularity === "daily" ? "default" : "outline"}
                  onClick={() => setGranularity("daily")}
                  className="text-xs px-3"
                >
                  Daily
                </Button>
                <Button
                  variant={granularity === "weekly" ? "default" : "outline"}
                  onClick={() => setGranularity("weekly")}
                  className="text-xs px-3"
                >
                  Weekly
                </Button>
                <Button
                  variant={granularity === "monthly" ? "default" : "outline"}
                  onClick={() => setGranularity("monthly")}
                  className="text-xs px-3"
                >
                  Monthly
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Growth Over Time</h2>
        <TimeSeriesChart
          data={filteredData}
          showLocal={serverType === "all" || serverType === "local"}
          showRemote={serverType === "all" || serverType === "remote"}
          showTotal={serverType === "all"}
        />
      </Card>
    </div>
  )
}
