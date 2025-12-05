"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Cell, Pie, PieChart, PieLabelRenderProps } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DashboardChartsProps {
  year: string
  period: string
}

interface BarData {
  month: string
  pengaduan: number
  permintaan_informasi: number
  saran: number
}

interface PieData {
  name: string
  value: number
  fill: string
}

interface ChartsData {
  overview: BarData[]
  distribution: PieData[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const barChartConfig = {
  pengaduan: {
    label: "Pengaduan",
    color: "hsl(var(--chart-1))",
  },
  permintaan_informasi: {
    label: "Permintaan Informasi",
    color: "hsl(var(--chart-2))",
  },
  saran: {
    label: "Saran",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

// #region Pie Chart Custom Label
const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartWithCustomizedLabel({ data, isAnimationActive = true }: { data: PieData[], isAnimationActive?: boolean }) {
  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        outerRadius={80}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
// #endregion

export function DashboardCharts({ year, period }: DashboardChartsProps) {
  const [data, setData] = React.useState<ChartsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/summary?year=${year}&period=${period}`)
        if (!res.ok) throw new Error("Failed to fetch charts")
        const json = await res.json()
        setData(json.data.charts)
      } catch (error) {
        console.error("Error fetching charts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [year, period])

  const formatMonth = (month: string) => {
    const monthMap: Record<string, string> = {
      Jan: "Januari", Feb: "Februari", Mar: "Maret", Apr: "April", May: "Mei", Jun: "Juni",
      Jul: "Juli", Aug: "Agustus", Sep: "September", Oct: "Oktober", Nov: "November", Dec: "Desember"
    }
    return monthMap[month] || month
  }

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-gray-100 animate-pulse" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="mx-auto aspect-square max-h-[250px] bg-gray-100 animate-pulse rounded-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Laporan Dumas</CardTitle>
          <CardDescription>Laporan Dumas per bulan di {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data.overview}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatMonth(value).slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="pengaduan" fill="var(--color-pengaduan)" radius={4} />
              <Bar dataKey="permintaan_informasi" fill="var(--color-permintaan_informasi)" radius={4} />
              <Bar dataKey="saran" fill="var(--color-saran)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>Report distribution by type</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center pb-0">
          <PieChartWithCustomizedLabel data={data.distribution} />
          <div className="mt-4 grid grid-cols-2 gap-4 w-full">
            {data.distribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.value} Laporan</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
