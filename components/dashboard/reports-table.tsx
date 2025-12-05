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
import { Search, Download, Gift, Users, FileText, FileSpreadsheet, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, Clock } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { generatePDF } from "@/lib/pdf-export"
import { toast } from "sonner"

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
  const [exporting, setExporting] = React.useState(false)

  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  React.useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchReports = async () => {
      setLoading(true)
      try {
        let endpoint = `${API_URL}/api/v1/dumas`
        const mapPeriod = (p: string) => {
          if (p === "q1") return "triwulan_1"
          if (p === "q2") return "triwulan_2"
          if (p === "q3") return "triwulan_3"
          if (p === "q4") return "triwulan_4"
          return "all"
        }

        const params: Record<string, string> = {
          year,
          period: mapPeriod(period),
          page: page.toString(),
          limit: "10",
          search: debouncedSearch
        }

        if (category === "pengaduan") {
          endpoint = `${API_URL}/api/v1/dumas`
        } else if (category === "permintaan-informasi") {
          endpoint = `${API_URL}/api/v1/permintaan-informasi`
        } else if (category === "saran") {
          endpoint = `${API_URL}/api/v1/saran`
        } else if (category === "gratifikasi") {
          endpoint = `${API_URL}/api/v1/gratifikasi`
        } else if (category === "benturan") {
          endpoint = `${API_URL}/api/v1/benturan-kepentingan`
        } else {
          endpoint = `${API_URL}/api/v1/dumas`
          params.category = category
        }

        const queryParams = new URLSearchParams(params)
        const fullUrl = `${endpoint}?${queryParams}`
        console.log("Fetching reports:", fullUrl)

        const res = await fetch(fullUrl, { signal })

        if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status} ${res.statusText}`)

        const text = await res.text()
        try {
          const json = JSON.parse(text)

          const apiPagination = json.data?.pagination
          let paginationData = null

          if (apiPagination) {
            const total = apiPagination.total || 0
            const limit = apiPagination.limit || 10
            const totalPages = apiPagination.totalPages || Math.ceil(total / limit)

            paginationData = {
              ...apiPagination,
              total,
              limit,
              totalPages
            }
          }

          if (!signal.aborted) {
            setReports(json.data?.data || [])
            setPagination(paginationData)
          }
        } catch (e) {
          console.error("Failed to parse reports JSON:", text)
          if (!signal.aborted) setReports([])
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error("Error fetching reports:", error)
        if (!signal.aborted) setReports([])
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchReports()

    if (page === 1 && debouncedSearch === "") {
      const interval = setInterval(fetchReports, 30000)
      return () => {
        controller.abort()
        clearInterval(interval)
      }
    }

    return () => controller.abort()
  }, [year, period, category, page, debouncedSearch])

  React.useEffect(() => {
    setPage(1)
  }, [year, period, category, debouncedSearch])

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "gratifikasi": return "Gratifikasi"
      case "benturan": return "Benturan Kepentingan"
      case "pengaduan": return "Pengaduan"
      case "permintaan-informasi": return "Permintaan Informasi"
      case "saran": return "Saran"
      default: return "Laporan"
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const queryParams = new URLSearchParams({
        year,
        period: period === "all" ? "all" : period,
      })

      const res = await fetch(`${API_URL}/api/v1/dumas/rekap?${queryParams}`)
      if (!res.ok) throw new Error("Failed to fetch report data")
      const json = await res.json()

      generatePDF(json.data)
      toast.success("Berhasil mengunduh laporan PDF")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Gagal mengunduh laporan PDF")
    } finally {
      setExporting(false)
    }
  }

  return (
    <Tabs value={category} onValueChange={setCategory} className="w-full space-y-4">
      <TabsList className="bg-transparent p-0 h-auto space-x-6 justify-start border-b w-full rounded-none overflow-x-auto">
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
        <TabsTrigger
          value="permintaan-informasi"
          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-0 pb-2 text-muted-foreground gap-2 shadow-none ring-0 focus-visible:ring-0 border-0"
        >
          <FileText className="h-4 w-4" />
          PERMINTAAN INFORMASI
        </TabsTrigger>
        <TabsTrigger
          value="saran"
          className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-0 pb-2 text-muted-foreground gap-2 shadow-none ring-0 focus-visible:ring-0 border-0"
        >
          <FileText className="h-4 w-4" />
          SARAN
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
                <Button variant="outline" className="h-8 gap-2 px-3" disabled={exporting}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-sm">{exporting ? "Exporting..." : "Export"}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
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
                  {category === "pengaduan" && (
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Tipe</TableHead>
                  )}
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status Pengaduan</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Tanggal Pengaduan</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={category === "pengaduan" ? 6 : 5} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={category === "pengaduan" ? 6 : 5} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.kode_pengaduan}</TableCell>
                      <TableCell>{report.nama}</TableCell>
                      {category === "pengaduan" && (
                        <TableCell className="text-muted-foreground">{report.tipe}</TableCell>
                      )}
                      <TableCell>
                        {(() => {
                          let badgeColor = "bg-gray-100 text-gray-600 hover:bg-gray-100"
                          let Icon = FileText

                          if (report.status.toLowerCase() === "baru") {
                            badgeColor = "bg-red-100 text-red-600 hover:bg-red-100"
                            Icon = CircleAlert
                          } else if (report.status.toLowerCase() === "progres") {
                            badgeColor = "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
                            Icon = Clock
                          } else if (report.status.toLowerCase() === "selesai") {
                            badgeColor = "bg-emerald-100 text-emerald-600 hover:bg-emerald-100"
                            Icon = CircleCheck
                          }

                          return (
                            <Badge variant="secondary" className={badgeColor}>
                              <Icon className="mr-1 h-3 w-3" /> {report.status}
                            </Badge>
                          )
                        })()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(report.tanggal_pengaduan), "dd MMMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => router.push(`/dashboard/sigap/${report.id}/edit?category=${category}`)}
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
          {pagination && (
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

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
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
