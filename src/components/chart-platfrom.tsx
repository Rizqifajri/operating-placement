"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { tableData } from "@/lib/table.data"

// Validasi data
const safeTableData = Array.isArray(tableData) ? tableData : []

// Hitung jumlah campaign per platform
const platformCount: Record<string, number> = {}
safeTableData.forEach((row) => {
  const platforms = row.platform?.split(",").map((p) => p.trim()) || []
  platforms.forEach((platform) => {
    if (platform) {
      platformCount[platform] = (platformCount[platform] || 0) + 1
    }
  })
})

const colors = [
  "#facc15", // yellow-400
  "#a78bfa", // purple-400
  "#4ade80", // green-400
  "#38bdf8", // sky-400
  "#fb7185", // rose-400
  "#f97316", // orange-400
]


// Data chart
const chartData = Object.entries(platformCount).map(
  ([platform, campaigns], index) => ({
    platform,
    campaigns,
    fill: colors[index % colors.length],
  })
)

const totalCampaigns = chartData.reduce((sum, entry) => sum + entry.campaigns, 0)

export function ChartPlatformPie() {
  if (chartData.length === 0) {
    return (
      <Card className="bg-white border">
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>No campaign data available.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-white border">
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
        <CardDescription className="text-gray-900">
          Campaign distribution by platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Chart + Total center */}
        <div className="relative mx-auto max-w-xs aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="campaigns"
                nameKey="platform"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={0}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white border shadow p-2 rounded text-xs">
                        <div className="font-medium text-black">{data.platform}</div>
                        <div className="text-gray-600">{data.campaigns}</div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Total center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-4xl font-bold text-black">{totalCampaigns}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          {chartData.map((item) => (
            <div
              key={item.platform}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.platform}</span>
              </div>
              <span className="text-sm font-medium">{item.campaigns}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
