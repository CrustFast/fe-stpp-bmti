import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

const dataPengaduan = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
  { value: 20 },
  { value: 18 },
  { value: 25 },
  { value: 22 },
  { value: 30 },
  { value: 28 },
  { value: 35 },
  { value: 20 },
  { value: 40 },
]

const dataKonsultasi = [
  { value: 40 },
  { value: 35 },
  { value: 38 },
  { value: 30 },
  { value: 25 },
  { value: 28 },
  { value: 20 },
  { value: 22 },
  { value: 18 },
  { value: 15 },
  { value: 12 },
  { value: 10 },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="overflow-hidden pb-0">
        <CardContent className="px-6 pt-4 pb-0">
          <div className="space-y-1 mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Total Pengaduan
            </p>
            <div className="text-3xl font-bold">192.10k</div>
          </div>
          <div className="h-[80px] -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataPengaduan} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
            <div className="text-3xl font-bold">1.34k</div>
          </div>
          <div className="h-[80px] -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataKonsultasi} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
