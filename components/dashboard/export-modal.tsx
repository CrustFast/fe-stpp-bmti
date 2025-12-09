"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { generatePDF, ReportData, ReportType } from "@/lib/pdf-export"
import { toast } from "sonner"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ReportData
  year: string
  period: string
}

export function ExportModal({ open, onOpenChange, data, year, period }: ExportModalProps) {
  const [reportType, setReportType] = React.useState<ReportType | "all">("5.3b")
  const [loading, setLoading] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (open && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          clearProps: "all"
        }
      )
    }
  }, [open])

  const handleExport = async () => {
    setLoading(true)
    try {
      if (reportType === "all") {
        await generatePDF(data, "5.3b", { year, period })
        await generatePDF(data, "5.3c", { year, period })
        await generatePDF(data, "5.3d", { year, period })
        toast.success("Berhasil mengunduh semua laporan PDF")
      } else {
        await generatePDF(data, reportType, { year, period })
        toast.success("Berhasil mengunduh laporan PDF")
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Gagal mengunduh laporan PDF")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={contentRef} className="sm:max-w-[425px] data-[state=open]:animate-none data-[state=closed]:!animate-fade-out-centered">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
          <DialogDescription>
            Pilih jenis laporan yang ingin diexport.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-type" className="text-right">
              Jenis Laporan
            </Label>
            <Select value={reportType} onValueChange={(val) => setReportType(val as ReportType | "all")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Laporan</SelectItem>
                <SelectItem value="5.3b">5.3b Laporan Pengaduan Masyarakat</SelectItem>
                <SelectItem value="5.3c">5.3c Laporan Monev</SelectItem>
                <SelectItem value="5.3d">5.3d Laporan Tinjut</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleExport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
