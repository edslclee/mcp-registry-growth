"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { StatCard } from "@/components/stats/stat-card"
import { ServerType, Granularity, ChartDataPoint, Snapshot } from "@/lib/types"
import { aggregateByGranularity } from "@/lib/data-aggregator"

interface DashboardClientProps {
  snapshots: Snapshot[]
}

export function DashboardClient({ snapshots }: DashboardClientProps) {
  const [serverType, setServerType] = useState<ServerType>("all")
  const [granularity, setGranularity] = useState<Granularity>("daily")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  // Get min/max dates from snapshots
  const minDate = snapshots.length > 0 ? snapshots[0].date : ""
  const maxDate = snapshots.length > 0 ? snapshots[snapshots.length - 1].date : ""

  // Filter snapshots by date range
  const filteredByDate = useMemo(() => {
    if (!startDate && !endDate) return snapshots

    return snapshots.filter(snap => {
      const snapDate = snap.date
      if (startDate && snapDate < startDate) return false
      if (endDate && snapDate > endDate) return false
      return true
    })
  }, [snapshots, startDate, endDate])

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const aggregated = aggregateByGranularity(filteredByDate, granularity)

    return aggregated.map(snapshot => {
      const point: ChartDataPoint = {
        date: snapshot.date,
        total: snapshot.total,
        local: snapshot.local,
        remote: snapshot.remote
      }
      return point
    })
  }, [filteredByDate, granularity])

  const filteredData = useMemo(() => {
    if (serverType === "all") return chartData

    return chartData.map(point => ({
      ...point,
      total: serverType === "local" ? point.local : point.remote
    }))
  }, [chartData, serverType])

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredByDate.length === 0) {
      return { currentTotal: 0, growth: 0, dataPoints: 0 }
    }

    const firstSnapshot = filteredByDate[0]
    const lastSnapshot = filteredByDate[filteredByDate.length - 1]

    const currentTotal = lastSnapshot.total
    const initialTotal = firstSnapshot.total
    const growth = currentTotal - initialTotal

    return {
      currentTotal,
      growth,
      dataPoints: filteredByDate.length
    }
  }, [filteredByDate])

  const handleReset = () => {
    setServerType("all")
    setGranularity("daily")
    setStartDate("")
    setEndDate("")
  }

  const lastUpdated = maxDate ? new Date(maxDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }) : ""

  const granularityLabel = granularity === "hourly" ? "daily" : granularity

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard
          title="Current Total"
          value={stats.currentTotal.toLocaleString()}
          subtitle="Total servers"
          valueColor="text-blue-400"
          compact={true}
        />
        <StatCard
          title="Growth"
          value={`+${stats.growth.toLocaleString()}`}
          subtitle="Since period start"
          valueColor="text-green-400"
          compact={true}
        />
        <StatCard
          title="Data Points"
          value={stats.dataPoints}
          subtitle={`${granularityLabel} intervals`}
          valueColor="text-slate-300"
          compact={true}
        />
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Server Type</label>
            <Select value={serverType} onValueChange={(value) => setServerType(value as ServerType)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Servers</SelectItem>
                <SelectItem value="local">Local Only</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Time Period</label>
            <Select value={granularity} onValueChange={(value) => setGranularity(value as Granularity)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-md text-sm text-slate-200 h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || minDate}
              max={maxDate}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-md text-sm text-slate-200 h-9"
            />
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 h-9"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Chart */}
      <Card className="bg-slate-900/50 border-slate-700 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-100">Server Growth Over Time</h2>
          <p className="text-sm text-slate-400 mt-1">
            Total server count aggregated by {granularityLabel} intervals
          </p>
        </div>
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
