"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Download, ExternalLink, Gift, Users, FileText, FileSpreadsheet, ChevronDown } from "lucide-react"

const reports = [
  {
    code: "373164",
    name: "-",
    type: "Luring",
    status: "Selesai",
    date: "26 April 2023",
  },
  {
    code: "887777",
    name: "-",
    type: "Luring",
    status: "Selesai",
    date: "25 April 2023",
  },
  {
    code: "630650",
    name: "-",
    type: "Luring",
    status: "Selesai",
    date: "23 April 2023",
  },
  {
    code: "932168",
    name: "-",
    type: "Luring",
    status: "Selesai",
    date: "22 April 2023",
  },
]

export function ReportsTable() {
  return (
    <Tabs defaultValue="pengaduan" className="w-full space-y-4">
      <TabsList className="bg-transparent p-0 h-auto space-x-6 justify-start border-b w-full rounded-none">
        <TabsTrigger
          value="gratifikasi"
          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-0 pb-2 text-muted-foreground gap-2 shadow-none ring-0 focus-visible:ring-0 border-0"
        >
          <Gift className="h-4 w-4" />
          GRATIFIKASI
        </TabsTrigger>
        <TabsTrigger
          value="benturan"
          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-0 pb-2 text-muted-foreground gap-2 shadow-none ring-0 focus-visible:ring-0 border-0"
        >
          <Users className="h-4 w-4" />
          BENTURAN KEPENTINGAN
        </TabsTrigger>
        <TabsTrigger
          value="pengaduan"
          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-0 pb-2 text-muted-foreground gap-2 shadow-none ring-0 focus-visible:ring-0 border-0"
        >
          <FileText className="h-4 w-4" />
          PENGADUAN
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pengaduan" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">SIGAP</CardTitle>
              <CardDescription>Laporan Pengaduan Eksternal</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="h-8">View all</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 gap-2 px-3">
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-sm">Export</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Excel</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari Pengaduan"
                className="pl-8 w-full md:w-[300px]"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Kode Pengaduan</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Nama</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Tipe</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status Pengaduan</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Tanggal Pengaduan</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.code}>
                      <TableCell className="font-medium">{report.code}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell className="text-muted-foreground">{report.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100">
                          <span className="mr-1">●</span> {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{report.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="gratifikasi">
        <Card>
          <CardHeader>
            <CardTitle>Gratifikasi</CardTitle>
            <CardDescription>Laporan Gratifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No data available.</div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="benturan">
        <Card>
          <CardHeader>
            <CardTitle>Benturan Kepentingan</CardTitle>
            <CardDescription>Laporan Benturan Kepentingan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No data available.</div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
