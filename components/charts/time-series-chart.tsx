"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartDataPoint } from "@/lib/types"

interface TimeSeriesChartProps {
  data: ChartDataPoint[]
  showLocal?: boolean
  showRemote?: boolean
  showTotal?: boolean
}

export function TimeSeriesChart({
  data,
  showLocal = true,
  showRemote = true,
  showTotal = true
}: TimeSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="timestamp"
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#f3f4f6'
          }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
            fontSize: '14px'
          }}
        />
        {showTotal && (
          <Line
            type="monotone"
            dataKey="total"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 3 }}
            name="Total Servers"
          />
        )}
        {showLocal && (
          <Line
            type="monotone"
            dataKey="local"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3 }}
            name="Local Servers"
          />
        )}
        {showRemote && (
          <Line
            type="monotone"
            dataKey="remote"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ fill: '#ec4899', r: 3 }}
            name="Remote Servers"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
