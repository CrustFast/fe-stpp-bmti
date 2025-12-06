"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatsCards, DashboardData } from "@/components/dashboard/stats-cards"
import { DashboardCharts, ChartsData } from "@/components/dashboard/charts"
import { ReportsTable } from "@/components/dashboard/reports-table"
import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function DashboardPage() {
  const [year, setYear] = useState("2025")
  const [period, setPeriod] = useState("all")

  const [statsData, setStatsData] = useState<DashboardData | null>(null)
  const [chartsData, setChartsData] = useState<ChartsData | null>(null)
  const [loading, setLoading] = useState(true)

  const periodLabels: Record<string, string> = {
    all: "Setahun Penuh",
    q1: "Triwulan 1",
    q2: "Triwulan 2",
    q3: "Triwulan 3",
    q4: "Triwulan 4",
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async (showLoading = true) => {
      if (showLoading) setLoading(true)
      try {
        const mapPeriod = (p: string) => {
          if (p === "q1") return "triwulan_1"
          if (p === "q2") return "triwulan_2"
          if (p === "q3") return "triwulan_3"
          if (p === "q4") return "triwulan_4"
          return "all"
        }

        const mappedPeriod = mapPeriod(period)
        const [summaryRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/summary?year=${year}&period=${mappedPeriod}`, { signal }),
          fetch(`${API_URL}/api/v1/dumas/stats/categories?year=${year}&period=${mappedPeriod}`, { signal })
        ])

        if (!summaryRes.ok) throw new Error(`Failed to fetch summary: ${summaryRes.status}`)
        if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.status}`)

        const summaryJson = await summaryRes.json()
        const categoriesJson = await categoriesRes.json()

        if (!signal.aborted) {
          setStatsData(summaryJson.data)
          setChartsData({
            categories: categoriesJson.data || [],
            distribution: summaryJson.data?.charts?.distribution || []
          })
        }

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error("Error fetching dashboard data:", error)
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData(true)

    const interval = setInterval(() => fetchData(false), 30000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [year, period])

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between space-y-2 mt-5">
        <h2 className="text-3xl font-bold tracking-tight">
          Laporan STPP {year} {period !== "all" && `- ${periodLabels[period]}`}
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Setahun Penuh</SelectItem>
              <SelectItem value="q1">Triwulan 1</SelectItem>
              <SelectItem value="q2">Triwulan 2</SelectItem>
              <SelectItem value="q3">Triwulan 3</SelectItem>
              <SelectItem value="q4">Triwulan 4</SelectItem>
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <StatsCards data={statsData} loading={loading} />
      <DashboardCharts data={chartsData} loading={loading} />
      <ReportsTable year={year} period={period} />
    </div>
  )
}
