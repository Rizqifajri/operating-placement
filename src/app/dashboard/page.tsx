"use client"

import * as React from "react"
import {
  TrendingUp,
  Users,
  Activity,
  Pencil,
  Send,
  Hourglass,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartQuarterBar } from "@/components/bar-chart"
import { ChartPlatformPie } from "@/components/chart-platfrom"
import { tableData } from "@/lib/table.data"
import { JSX } from "react"

type Status =
  | "development"
  | "proposed"
  | "editing"
  | "delivered"
  | "on-going"
  | "published"

const statusLabels: Record<Status, string> = {
  development: "Development",
  proposed: "Content Proposed",
  editing: "Editing",
  delivered: "Delivered",
  "on-going": "On Going",
  published: "Published",
}

const statusIcons: Record<Status, JSX.Element> = {
  development: <Pencil className="h-5 w-5 text-gray-900" />,
  proposed: <TrendingUp className="h-5 w-5 text-gray-900" />,
  editing: <FileText className="h-5 w-5 text-gray-900" />,
  delivered: <Send className="h-5 w-5 text-gray-900" />,
  "on-going": <Hourglass className="h-5 w-5 text-gray-900" />,
  published: <CheckCircle2 className="h-5 w-5 text-gray-900" />,
}

export default function Dashboard() {
  const totalCampaigns = tableData.length

  const marketingCount = tableData.filter((item) => item.division === "Marketing").length
  const communityCount = tableData.filter((item) => item.division === "Community").length

  const normalizeStatus = (s: string) =>
    s.toLowerCase().replace(/\s/g, "-") as Status

  const countByStatus = tableData.reduce((acc, item) => {
    const status = normalizeStatus(item.status)
    if (acc[status]) acc[status]++
    else acc[status] = 1
    return acc
  }, {} as Record<Status, number>)

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <Card className="bg-white border-black border-r-4 border-b-4 w-full lg:w-[500px] hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-3xl font-medium text-gray-900">
                Total Campaigns
              </CardTitle>
              <Activity className="h-7 w-7 text-gray-900" />
            </CardHeader>
            <CardContent>
              <div className="text-9xl font-bold text-gray-900">{totalCampaigns}</div>
              <p className="text-xs text-green-600 mb-4">+20.1% from last month</p>

              <div className="flex justify-between text-sm text-gray-700">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Marketing</span>
                  <span>{marketingCount} campaigns</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold">Community</span>
                  <span>{communityCount} campaigns</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Object.keys(statusLabels).map((key) => {
              const status = key as Status
              const value = countByStatus[status] || 0
              const icon = statusIcons[status]

              return (
                <Card
                  key={status}
                  className="bg-white hover:shadow-md transition-shadow border-black border-r-4 border-b-4"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-medium text-gray-900">
                      {statusLabels[status]}
                    </CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{value}</div>
                    <p className="text-xs text-green-600">+2% from last month</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit mt-6">
          <ChartQuarterBar />
          <ChartPlatformPie />
        </div>
      </main>
    </div>
  )
}
