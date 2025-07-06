"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { tableData } from "@/lib/table.data"

// 1. Hitung jumlah campaign per quarter
const quarterCount = tableData.reduce((acc, row) => {
  const quarter = row.quarter
  acc[quarter] = (acc[quarter] || 0) + 1
  return acc
}, {} as Record<string, number>)

// 2. Ubah ke format array untuk chart
const chartData = Object.entries(quarterCount).map(([quarter, count]) => ({
  quarter,
  campaigns: count,
}))

// 3. Konfigurasi warna
const chartConfig = {
  campaigns: {
    label: "Campaigns",
    color: "#3B82F6", // biru
  },
} satisfies ChartConfig

export function ChartQuarterArea() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaigns per Quarter</CardTitle>
        <CardDescription>Based on all campaign data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="campaigns"
              type="monotone"
              fill="#3B82F6"
              fillOpacity={0.3}
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up this quarter <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Based on Q1–Q4 2024</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
