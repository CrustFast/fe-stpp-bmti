"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Label } from "recharts"

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

const getChartData = (year: string, period: string) => {
  const baseValue = parseInt(year)

  // Generate monthly data based on period
  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  if (period === "q1") months = months.slice(0, 3)
  if (period === "q2") months = months.slice(3, 6)
  if (period === "q3") months = months.slice(6, 9)
  if (period === "q4") months = months.slice(9, 12)

  const barData = months.map(month => ({
    month,
    desktop: Math.floor(Math.random() * 300) + 50 + (baseValue % 100),
    mobile: Math.floor(Math.random() * 200) + 30 + (baseValue % 50)
  }))

  const pieData = [
    { browser: "chrome", visitors: Math.floor(Math.random() * 300) + 100, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: Math.floor(Math.random() * 250) + 80, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: Math.floor(Math.random() * 200) + 60, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: Math.floor(Math.random() * 150) + 40, fill: "var(--color-edge)" },
    { browser: "other", visitors: Math.floor(Math.random() * 100) + 20, fill: "var(--color-other)" },
  ]

  return { barData, pieData }
}

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function DashboardCharts({ year, period }: DashboardChartsProps) {
  const { barData, pieData } = React.useMemo(() => getChartData(year, period), [year, period])

  const totalVisitors = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [pieData])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Monthly data overview for {year} {period !== "all" ? `(${period.toUpperCase()})` : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
          <CardDescription>Visitor distribution by browser</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
