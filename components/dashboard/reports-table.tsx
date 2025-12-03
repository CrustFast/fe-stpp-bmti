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
import { Search, Download, Gift, Users, FileText, FileSpreadsheet, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface ReportsTableProps {
  year: string
  period: string
}

interface Report {
  id: number
  kode_pengaduan: string
  nama: string
  tipe: string
  status: string
  tanggal_pengaduan: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function ReportsTable({ year, period }: ReportsTableProps) {
  const router = useRouter()
  const [category, setCategory] = React.useState("pengaduan")
  const [reports, setReports] = React.useState<Report[]>([])
  const [pagination, setPagination] = React.useState<Pagination | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          year,
          period: period === "all" ? "year" : period,
          category,
          page: page.toString(),
          limit: "10",
          search
        })

        const res = await fetch(`${API_URL}/api/v1/dumas?${queryParams}`)
        if (!res.ok) throw new Error("Failed to fetch reports")
        const json = await res.json()
        setReports(json.data?.data || [])
        setPagination(json.data?.pagination || null)
      } catch (error) {
        console.error("Error fetching reports:", error)
        setReports([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()

    if (page === 1 && search === "") {
      const interval = setInterval(fetchReports, 10000)
      return () => clearInterval(interval)
    }
  }, [year, period, category, page, search])

  React.useEffect(() => {
    setPage(1)
  }, [year, period, category, search])

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "gratifikasi": return "Gratifikasi"
      case "benturan": return "Benturan Kepentingan"
      case "pengaduan": return "Pengaduan"
      default: return "Laporan"
    }
  }

  return (
    <Tabs value={category} onValueChange={setCategory} className="w-full space-y-4">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">
              {category === "pengaduan" ? "SIGAP" : getCategoryLabel(category)}
            </CardTitle>
            <CardDescription>
              Laporan {getCategoryLabel(category)} {year} {period !== "all" ? `(${period.toUpperCase()})` : ""}
            </CardDescription>
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
              placeholder={`Cari ${getCategoryLabel(category)}...`}
              className="pl-8 w-full md:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.kode_pengaduan}</TableCell>
                      <TableCell>{report.nama}</TableCell>
                      <TableCell className="text-muted-foreground">{report.tipe}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100">
                          <span className="mr-1">●</span> {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(report.tanggal_pengaduan), "dd MMMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                          onClick={() => router.push(`/dashboard/sigap/${report.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Tabs>
  )
}
