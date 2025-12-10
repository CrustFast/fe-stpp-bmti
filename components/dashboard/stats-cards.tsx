import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { FileText, MessageSquare, CheckCircle, Clock } from "lucide-react"

export interface StatItem {
  name: string
  pending: number
  resolved: number
}

export interface DashboardData {
  stats: StatItem[]
  charts?: {
    distribution: {
      name: string
      value: number
    }[]
  }
}

interface StatsCardsProps {
  data: DashboardData | null
  loading: boolean
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Jumlah total
  const totalPengaduan = data.charts?.distribution?.find(d => d.name === "Pengaduan")?.value
    ?? data.stats.find(s => s.name === "Pengaduan")?.pending
    ?? 0

  const totalInfo = data.charts?.distribution?.find(d => d.name === "Permintaan Informasi")?.value
    ?? data.stats.find(s => s.name === "Permintaan Informasi")?.pending
    ?? 0

  const totalResolved = data.stats.reduce((acc, curr) => acc + curr.resolved, 0)
  const totalPending = data.stats.reduce((acc, curr) => acc + curr.pending, 0)

  const cards = [
    {
      title: "Total Pengaduan",
      value: totalPengaduan,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Permintaan Informasi",
      value: totalInfo,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Laporan Sudah Ditangani",
      value: totalResolved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Laporan Belum Ditangani",
      value: totalPending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="px-4 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
