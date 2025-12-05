import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { FileText, MessageSquare, CheckCircle, Clock } from "lucide-react"

interface StatsCardsProps {
  year: string
  period: string
}

interface StatItem {
  name: string
  pending: number
  resolved: number
}

interface DashboardData {
  stats: StatItem[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function StatsCards({ year, period }: StatsCardsProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/summary?year=${year}&period=${period}`)
        if (!res.ok) throw new Error("Failed to fetch stats")
        const json = await res.json()
        setData(json.data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [year, period])

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
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
  const totalPengaduan = data.stats.find(s => s.name === "Pengaduan")
    ? (data.stats.find(s => s.name === "Pengaduan")!.pending + data.stats.find(s => s.name === "Pengaduan")!.resolved)
    : 0

  const totalInfo = data.stats.find(s => s.name === "Permintaan Informasi")
    ? (data.stats.find(s => s.name === "Permintaan Informasi")!.pending + data.stats.find(s => s.name === "Permintaan Informasi")!.resolved)
    : 0

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
          <CardContent className="p-6">
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
