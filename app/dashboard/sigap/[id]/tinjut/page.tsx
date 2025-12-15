"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import NProgress from "nprogress"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface Report {
    JenisLayanan?: string
    KlasifikasiLaporan?: string
    koreksi?: string
    analisis_penyebab?: string
    tindakan_korektif?: string
    tanggapan?: string
}

export default function TinjutPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = params.id as string
    const category = searchParams.get("category")

    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<Report | null>(null)
    const [koreksi, setKoreksi] = useState("")
    const [analisisPenyebab, setAnalisisPenyebab] = useState("")
    const [tindakanKorektif, setTindakanKorektif] = useState("")
    const [tanggapan, setTanggapan] = useState("")

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
                setReport(json.data)

                // Pre-fill if data exists
                if (json.data) {
                    setKoreksi(json.data.koreksi || "")
                    setAnalisisPenyebab(json.data.analisis_penyebab || "")
                    setTindakanKorektif(json.data.tindakan_korektif || "")
                    setTanggapan(json.data.tanggapan || "")
                }
            } catch (error) {
                console.error("Error fetching report:", error)
            }
        }
        if (id) fetchReport()
    }, [id, category])



    const handleSave = async () => {
        setLoading(true)
        NProgress.start()
        try {
            const apiType = getApiType(category)
            const endpoint = `${API_URL}/api/v1/${apiType}/${id}`

            let payload: any = {}

            if (category === "permintaan-informasi") {
                payload = {
                    tanggapan,
                    status: "selesai"
                }
            } else {
                payload = {
                    koreksi,
                    analisis_penyebab: analisisPenyebab,
                    tindakan_korektif: tindakanKorektif,
                    status: "proses"
                }
            }

            const res = await fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save tindak lanjut")

            if (category === "permintaan-informasi") {
                toast.success("Tanggapan disimpan. Laporan selesai.")
                router.push("/dashboard")
            } else {
                toast.success("Tindak lanjut disimpan. Lanjut ke Rekapitulasi.")
                router.push(`/dashboard/sigap/${id}/rekap?category=${category}`)
            }
        } catch (error) {
            console.error("Error saving tinjut:", error)
            toast.error("Gagal menyimpan tindak lanjut")
        } finally {
            setLoading(false)
        }
    }

    const breadcrumbLabel = report ? (report.JenisLayanan || report.KlasifikasiLaporan) : "..."

    return (
        <div className="flex flex-col space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground pt-6">
                <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/dashboard")}>Dashboard</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>SIGAP</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>{breadcrumbLabel}</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="cursor-pointer hover:text-foreground" onClick={() => router.push(`/dashboard/sigap/${id}/edit?category=${category}`)}>Edit</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-foreground">Tindak Lanjut</span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tindak Lanjut Laporan</CardTitle>
                    <CardDescription>
                        {category === "permintaan-informasi"
                            ? "Silahkan isi tanggapan untuk permintaan informasi ini."
                            : "Silahkan isi form tindak lanjut berikut ini."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {category === "permintaan-informasi" ? (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tanggapan">Tanggapan</Label>
                                <Textarea
                                    id="tanggapan"
                                    placeholder="Masukkan tanggapan..."
                                    value={tanggapan}
                                    onChange={(e) => setTanggapan(e.target.value)}
                                    className="min-h-[150px]"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="koreksi">Koreksi</Label>
                                <Textarea
                                    id="koreksi"
                                    placeholder="Masukkan koreksi..."
                                    value={koreksi}
                                    onChange={(e) => setKoreksi(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="analisis">Analisis Penyebab</Label>
                                <Textarea
                                    id="analisis"
                                    placeholder="Masukkan analisis penyebab..."
                                    value={analisisPenyebab}
                                    onChange={(e) => setAnalisisPenyebab(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tindakan">Tindakan Korektif</Label>
                                <Textarea
                                    id="tindakan"
                                    placeholder="Masukkan tindakan korektif..."
                                    value={tindakanKorektif}
                                    onChange={(e) => setTindakanKorektif(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            Kembali
                        </Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Menyimpan..." : (category === "permintaan-informasi" ? "Simpan & Selesai" : "Simpan & Lanjut")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
