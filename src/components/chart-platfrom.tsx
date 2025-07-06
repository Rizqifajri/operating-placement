"use client"

import { PieChart, Pie, Cell, Label } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { tableData } from "@/lib/table.data"

// 1. Validasi tableData
const safeTableData = Array.isArray(tableData) ? tableData : []

// 2. Hitung distribusi platform
const platformCount: Record<string, number> = {}
safeTableData.forEach((row) => {
  const platforms = row.platform?.split(",").map((p) => p.trim()) || []
  platforms.forEach((platform) => {
    if (platform) {
      platformCount[platform] = (platformCount[platform] || 0) + 1
    }
  })
})

// 3. Warna-warna untuk platform
const colors = [
  "#3B82F6", "#FD1D1D", "#F59E0B", "#8B5CF6", "#EF4444",
  "#6366F1", "#F472B6", "#14B8A6"
]

// 4. Konversi data menjadi array untuk chart
const chartData = Object.entries(platformCount).map(
  ([platform, campaigns], index) => ({
    platform,
    campaigns,
    fill: colors[index % colors.length],
  })
)

// 5. Hitung total campaign
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
        <ChartContainer config={{ campaigns: { label: "Campaigns", color: "#3B82F6" } }} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="rounded-xl bg-gray-700 border-gray-600"
                />
              }
            />
            <Pie
              className="cursor-pointer"
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
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-white text-3xl font-bold">
                          {totalCampaigns}
                        </tspan>
                        <tspan
                          y={(viewBox.cy || 0) + 24}
                          x={viewBox.cx}
                          className="fill-gray-400 text-sm"
                        >
                          Total Campaigns
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 space-y-2">
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
