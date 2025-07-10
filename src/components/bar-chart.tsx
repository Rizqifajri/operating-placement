"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardTitle } from "./ui/card"
import { tableData } from "@/lib/table.data"


const quarterCount = tableData.reduce((acc, row) => {
  const quarter = row.quarter || "Unknown"
  acc[quarter] = (acc[quarter] || 0) + 1
  return acc
}, {} as Record<string, number>)


const chartData = Object.entries(quarterCount).map(([quarter, count]) => ({
  quarter,
  count,
}))


const quarterOrder = ["Q1", "Q2", "Q3", "Q4"]
const sortedChartData = chartData.sort((a, b) => {
  return quarterOrder.indexOf(a.quarter) - quarterOrder.indexOf(b.quarter)
})


const chartConfig = {
  count: {
    label: "Quarter",
    color: "#c084fc", 
  },
} satisfies ChartConfig

export function ChartQuarterBar() {
  return (
    <Card className="border-black border-r-4 border-b-4">
      <CardTitle className="text-lg px-5 pt-5">Quarter</CardTitle>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full px-5 pb-5">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="quarter"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend className="bg-white" content={<ChartLegendContent payload={undefined} />} />
          <Bar dataKey="count" fill="#c084fc" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
