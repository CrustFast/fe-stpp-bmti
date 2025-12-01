import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface StatsCardsProps {
  year: string
  period: string
}

const getMockData = (year: string, period: string) => {
  // Simple seed-like behavior based on year and period string length
  const baseValue = parseInt(year) + period.length

  const generateData = (base: number) => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: Math.floor(Math.random() * 50) + base + i
    }))
  }

  return {
    pengaduan: {
      total: period === "all" ? "192.10k" : `${(192 / 4).toFixed(2)}k`,
      data: generateData(baseValue % 10)
    },
    konsultasi: {
      total: period === "all" ? "1.34k" : `${(1.34 / 4).toFixed(2)}k`,
      data: generateData((baseValue + 5) % 10)
    }
  }
}

export function StatsCards({ year, period }: StatsCardsProps) {
  const data = getMockData(year, period)

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
              <AreaChart data={data.pengaduan.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
              <AreaChart data={data.konsultasi.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
