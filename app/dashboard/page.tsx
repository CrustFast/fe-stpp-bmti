"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DashboardCharts } from "@/components/dashboard/charts"
import { ReportsTable } from "@/components/dashboard/reports-table"
import { useState } from "react"

export default function DashboardPage() {
  const [year, setYear] = useState("2025")
  const [period, setPeriod] = useState("all")

  const periodLabels: Record<string, string> = {
    all: "Setahun Penuh",
    q1: "Triwulan 1",
    q2: "Triwulan 2",
    q3: "Triwulan 3",
    q4: "Triwulan 4",
  }

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
      <StatsCards />
      <DashboardCharts />
      <ReportsTable />
    </div>
  )
}
