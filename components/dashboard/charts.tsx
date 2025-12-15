"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart, PieLabelRenderProps, LabelList } from "recharts"

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

export interface CategoryStat {
  no: number
  kode: string
  nama: string
  jumlah: number
}

export interface PieData {
  name: string
  value: number
  fill: string
}

export interface ChartsData {
  categories: CategoryStat[]
  distribution: PieData[]
}

interface DashboardChartsProps {
  data: ChartsData | null
  loading: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const chartConfig = {
  jumlah: {
    label: "Jumlah",
    color: "#2563eb",
  },
} satisfies ChartConfig

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

export function DashboardCharts({ data, loading }: DashboardChartsProps) {
  const [isAnimationActive, setIsAnimationActive] = React.useState(false)

  React.useEffect(() => {
    if (!loading && data) {
      setIsAnimationActive(true)
      const timer = setTimeout(() => {
        setIsAnimationActive(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loading, data])

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
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
          <CardTitle>Statistik Kategori Pengaduan</CardTitle>
          <CardDescription>Jumlah laporan berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <BarChart
              key={JSON.stringify(data.categories)}
              accessibilityLayer
              data={data.categories}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="nama"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={150}
                style={{ fontSize: '12px' }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={4} isAnimationActive={isAnimationActive}>
                <LabelList
                  dataKey="jumlah"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Pembagian Laporan</CardTitle>
          <CardDescription>Berdasarkan Pengaduan, Permintaan Informasi dan Saran</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center pb-0">
          <PieChartWithCustomizedLabel
            key={JSON.stringify(data.distribution)}
            data={data.distribution}
            isAnimationActive={isAnimationActive}
          />
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
