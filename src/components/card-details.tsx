// components/card-detail.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CardDetailProps {
  data: {
    no: number
    source: string
    division: string
    brand: string
    category: string
    quarter: string
    platform: string
    sow: string
    content: string
    link: string
    status: string
    date: string
  } | null
  onClose: () => void
}

export const CardDetail = ({ data, onClose }: CardDetailProps) => {
  if (!data) return null

  return (
    <Card className="w-full mt-6 bg-white border border-gray-300 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Detail Data - {data.brand}</CardTitle>
            <CardDescription>All information related to the selected campaign</CardDescription>
          </div>
          <button onClick={onClose} className="text-sm text-red-500 hover:underline">
            Close
          </button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        <p><strong>Source:</strong> {data.source}</p>
        <p><strong>Division:</strong> {data.division}</p>
        <p><strong>Brand:</strong> {data.brand}</p>
        <p><strong>Category:</strong> {data.category}</p>
        <p><strong>Quarter:</strong> {data.quarter}</p>
        <p><strong>Platform:</strong> {data.platform}</p>
        <p><strong>SOW:</strong> {data.sow}</p>
        <p><strong>Content:</strong> {data.content}</p>
        <p>
          <strong>Link:</strong>{" "}
          {data.link ? (
            <a href={data.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              View
            </a>
          ) : (
            "-"
          )}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <Badge className="bg-gray-100 text-gray-700 border">{data.status}</Badge>
        </p>
        <p><strong>Date:</strong> {data.date}</p>
      </CardContent>
    </Card>
  )
}
