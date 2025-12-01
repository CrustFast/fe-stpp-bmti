import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"

interface StatsCardsProps {
  year: string
  period: string
}

interface TrendData {
  value: number
}

interface StatItem {
  total: string
  trend: TrendData[]
}

interface StatsData {
  pengaduan: StatItem
  konsultasi: StatItem
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function StatsCards({ year, period }: StatsCardsProps) {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/summary?year=${year}&period=${period}`)
        if (!res.ok) throw new Error("Failed to fetch stats")
        const json = await res.json()
        setData(json.data.stats)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [year, period])

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden pb-0">
            <CardContent className="px-6 pt-4 pb-0">
              <div className="space-y-1 mb-8">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-2" />
              </div>
              <div className="h-[80px] -mx-6 bg-gray-100 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="overflow-hidden pb-0">
        <CardContent className="px-6 pt-4 pb-0">
          <div className="space-y-1 mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Total Pengaduan
            </p>
            <div className="text-3xl font-bold">{data.pengaduan.total}</div>
          </div>
          <div className="h-[80px] -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.pengaduan.trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPengaduan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPengaduan)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden pb-0">
        <CardContent className="px-6 pt-4 pb-0">
          <div className="space-y-1 mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Total Permintaan Konsultasi
            </p>
            <div className="text-3xl font-bold">{data.konsultasi.total}</div>
          </div>
          <div className="h-[80px] -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.konsultasi.trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKonsultasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorKonsultasi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
