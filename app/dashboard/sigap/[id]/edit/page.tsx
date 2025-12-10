"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Download, X } from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import NProgress from "nprogress"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ReportDetail {
  ID: number
  KlasifikasiLaporan: string
  TanggalPengaduan?: string
  JenisLayanan?: string
  Tipe?: string
  KategoriPengaduan?: {
    kategori_id: string
    nama_kategori: string
  }
  PeriodeDiklatMulai?: string
  PeriodeDiklatAkhir?: string
  NamaDiklat?: string
  NIP?: string
  NamaPesertaDiklat?: string
  NomorTeleponPesertaDiklat?: string
  AsalSmkPesertaDiklat?: string
  ProgramKeahlian?: {
    id: number
    nama_program_keahlian: string
    kode: string
  }
  PeriodeMagangMulai?: string
  PeriodeMagangAkhir?: string
  NamaPesertaPkl?: string
  NomorTeleponPesertaPkl?: string
  AsalSmkPesertaPkl?: string
  Unit?: string
  TanggalPenggunaanMulai?: string
  TanggalPenggunaanAkhir?: string
  NamaPenggunaFasilitas?: string
  NomorTeleponPenggunaFasilitas?: string
  EmailPenggunaFasilitas?: string
  NamaFasilitas?: string
  NamaMasyarakatUmum?: string
  NomorTeleponMasyarakatUmum?: string
  EmailMasyarakatUmum?: string
  AlamatMasyarakatUmum?: string
  NamaPemintaInformasi?: string
  PekerjaanPemintaInformasi?: string
  NomorTeleponPemintaInformasi?: string
  EmailPemintaInformasi?: string
  NamaAduanInformasi?: string
  NomorTeleponAduanSaran?: string
  EmailAduanSaran?: string
  BuktiFotoPath?: string[]
  bukti_foto_path?: string[]
  IsiLaporanPengaduan?: string
  IsiLaporanPermintaanInformasi?: string
  IsiLaporanSaran?: string
  Privasi?: string
  KodePengaduan: string
  Status: string
  CreatedAt: string
  UpdatedAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const formatDate = (dateString?: string) => {
  if (!dateString) return "-"
  try {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: idLocale })
  } catch {
    return "-"
  }
}

export default function EditReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const category = searchParams.get("category")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [report, setReport] = useState<ReportDetail | null>(null)
  const [status, setStatus] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const getApiType = (cat: string | null) => {
    switch (cat) {
      case "pengaduan": return "dumas"
      case "permintaan-informasi": return "permintaan-informasi"
      case "saran": return "saran"
      case "gratifikasi": return "gratifikasi"
      case "benturan": return "benturan-kepentingan"
      default: return "dumas"
    }
  }

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiType = getApiType(category)
        const endpoint = `${API_URL}/api/v1/${apiType}/${id}`

        const res = await fetch(endpoint)
        if (!res.ok) throw new Error("Failed to fetch report")
        const json = await res.json()
        const data = json.data
        console.log("Report Data:", data)
        setReport(data)
        setStatus(data.Status?.toLowerCase() || "")
      } catch (error) {
        console.error("Error fetching report:", error)
        toast.error("Gagal mengambil data laporan")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReport()
    }
  }, [id, category])



  const handleSave = async () => {
    setSaving(true)
    NProgress.start()
    try {
      const apiType = getApiType(category)
      const endpoint = `${API_URL}/api/v1/${apiType}/${id}`

      // Auto-update status to 'proses'
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "proses" }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast.success("Status diperbarui ke Proses. Silahkan isi tindak lanjut.")

      // Redirect to Tinjut page
      router.push(`/dashboard/sigap/${id}/tinjut?category=${category}`)
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Gagal memperbarui status")
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = url.split('/').pop() || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Gagal mengunduh gambar')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!report) {
    return <div className="p-8 text-center">Laporan tidak ditemukan</div>
  }

  const isDiklat = report.JenisLayanan === 'diklat' || !!report.NamaPesertaDiklat
  const isPkl = !!report.NamaPesertaPkl
  const isFasilitas = !!report.NamaPenggunaFasilitas
  const isKunjungan = !!report.NamaMasyarakatUmum

  const buktiFoto = report.BuktiFotoPath || report.bukti_foto_path || []

  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground pt-6">
        <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/dashboard")}>Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>SIGAP</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{report.JenisLayanan || report.KlasifikasiLaporan}</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">Edit</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Laporan</CardTitle>
          <CardDescription>
            Anda sedang meninjau laporan. Perubahan hanya dapat dilakukan pada status laporan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Umum</h3>

            <div className="grid gap-4">
              {/* Klasifikasi */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-left">Klasifikasi</Label>
                <div className="col-span-3">
                  <RadioGroup defaultValue={report.KlasifikasiLaporan} disabled className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pengaduan" id="pengaduan" checked={report.KlasifikasiLaporan === "pengaduan"} />
                      <Label htmlFor="pengaduan">Pengaduan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="permintaan-informasi" id="permintaan" checked={report.KlasifikasiLaporan === "permintaan-informasi" || report.KlasifikasiLaporan === "permintaan_informasi"} />
                      <Label htmlFor="permintaan">Permintaan Informasi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="saran" id="saran" checked={report.KlasifikasiLaporan === "saran"} />
                      <Label htmlFor="saran">Saran</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Kode Pengaduan */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Kode Pengaduan</Label>
                <Input value={report.KodePengaduan} readOnly className="col-span-3 bg-muted/50" />
              </div>

              {/* Status Hidden - Auto updated to 'proses' on Tinjau */}
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label>Status</Label>
                <div className="col-span-3">
                  <Input value={status} readOnly className="bg-muted/50" />
                </div>
              </div> */}
            </div>

            {/* --- PENGADUAN SECTION --- */}
            {report.KlasifikasiLaporan === 'pengaduan' && (
              <>
                <div className="grid gap-4 mt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Tanggal Pengaduan</Label>
                    <Input value={formatDate(report.TanggalPengaduan)} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Jenis Layanan</Label>
                    <Input value={report.JenisLayanan || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Kategori</Label>
                    <Input
                      value={report.KategoriPengaduan ? `${report.KategoriPengaduan.nama_kategori} (${report.KategoriPengaduan.kategori_id})` : "-"}
                      readOnly
                      className="col-span-3 bg-muted/50"
                    />
                  </div>
                </div>

                {isDiklat && (
                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium text-muted-foreground">Data Peserta Diklat</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Periode Diklat</Label>
                        <Input value={`${formatDate(report.PeriodeDiklatMulai)} - ${formatDate(report.PeriodeDiklatAkhir)}`} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Nama Diklat</Label>
                        <Input value={report.NamaDiklat || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>NIP</Label>
                        <Input value={report.NIP || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Nama Peserta</Label>
                        <Input value={report.NamaPesertaDiklat || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>No. Telepon</Label>
                        <Input value={report.NomorTeleponPesertaDiklat || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Asal SMK</Label>
                        <Input value={report.AsalSmkPesertaDiklat || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Program Keahlian</Label>
                        <Input
                          value={report.ProgramKeahlian ? `${report.ProgramKeahlian.nama_program_keahlian} (${report.ProgramKeahlian.kode})` : "-"}
                          readOnly
                          className="col-span-3 bg-muted/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isPkl && (
                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium text-muted-foreground">Data Peserta PKL</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Periode Magang</Label>
                        <Input value={`${formatDate(report.PeriodeMagangMulai)} - ${formatDate(report.PeriodeMagangAkhir)}`} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Nama Peserta</Label>
                        <Input value={report.NamaPesertaPkl || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>No. Telepon</Label>
                        <Input value={report.NomorTeleponPesertaPkl || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Asal SMK/PT</Label>
                        <Input value={report.AsalSmkPesertaPkl || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Unit</Label>
                        <Input value={report.Unit || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                    </div>
                  </div>
                )}

                {isFasilitas && (
                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium text-muted-foreground">Data Pengguna Fasilitas</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Tanggal Penggunaan</Label>
                        <Input value={`${formatDate(report.TanggalPenggunaanMulai)} - ${formatDate(report.TanggalPenggunaanAkhir)}`} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Nama Pengguna</Label>
                        <Input value={report.NamaPenggunaFasilitas || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>No. Telepon</Label>
                        <Input value={report.NomorTeleponPenggunaFasilitas || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Email</Label>
                        <Input value={report.EmailPenggunaFasilitas || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Fasilitas</Label>
                        <Input value={report.NamaFasilitas || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                    </div>
                  </div>
                )}

                {isKunjungan && (
                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium text-muted-foreground">Data Masyarakat Umum</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Privasi</Label>
                        <Input value={report.Privasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Nama</Label>
                        <Input value={report.NamaMasyarakatUmum || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>No. Telepon</Label>
                        <Input value={report.NomorTeleponMasyarakatUmum || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Email</Label>
                        <Input value={report.EmailMasyarakatUmum || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="mt-2">Alamat</Label>
                        <Textarea value={report.AlamatMasyarakatUmum || "-"} readOnly className="col-span-3 bg-muted/50" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-start gap-4 mt-6 border-t pt-4">
                  <Label className="mt-2">Isi Pengaduan</Label>
                  <Textarea value={report.IsiLaporanPengaduan || "-"} readOnly className="col-span-3 bg-muted/50 min-h-[100px]" />
                </div>

                {/* Bukti Lampiran - Pengaduan */}
                {report.KlasifikasiLaporan === 'pengaduan' && buktiFoto.length > 0 && (
                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium text-muted-foreground">Bukti Lampiran</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {buktiFoto.map((path, index) => {
                        const fullPath = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                        return (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer">
                            <img
                              src={fullPath}
                              alt={`Bukti ${index + 1}`}
                              className="object-cover w-full h-full transition-transform hover:scale-105"
                              onClick={() => setSelectedImage(fullPath)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* --- PERMINTAAN INFORMASI --- */}
            {(report.KlasifikasiLaporan === 'permintaan-informasi' || report.KlasifikasiLaporan === 'permintaan_informasi') && (
              <div className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Nama Peminta</Label>
                    <Input value={report.NamaPemintaInformasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Pekerjaan</Label>
                    <Input value={report.PekerjaanPemintaInformasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>No. Telepon</Label>
                    <Input value={report.NomorTeleponPemintaInformasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Email</Label>
                    <Input value={report.EmailPemintaInformasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="mt-2">Detail Keperluan</Label>
                    <Textarea value={report.IsiLaporanPermintaanInformasi || "-"} readOnly className="col-span-3 bg-muted/50 min-h-[100px]" />
                  </div>
                </div>
              </div>
            )}

            {/* --- SARAN --- */}
            {report.KlasifikasiLaporan === 'saran' && (
              <div className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Nama</Label>
                    <Input value={report.NamaAduanInformasi || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>No. Telepon</Label>
                    <Input value={report.NomorTeleponAduanSaran || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Email</Label>
                    <Input value={report.EmailAduanSaran || "-"} readOnly className="col-span-3 bg-muted/50" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="mt-2">Isi Saran</Label>
                    <Textarea value={report.IsiLaporanSaran || "-"} readOnly className="col-span-3 bg-muted/50 min-h-[100px]" />
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? "Menyimpan..." : "Tinjau"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
