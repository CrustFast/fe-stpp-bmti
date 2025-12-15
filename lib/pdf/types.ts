export interface ReportData {
  year: string
  period: string
  saluran_pengaduan: { kode: string; nama: string; jumlah: number }[]
  klasifikasi_pengaduan: { no: number; kode: string; nama: string; jumlah: number }[]
  pengaduan_masyarakat: {
    group: string
    items: {
      kode: string
      nama: string
      counts: Record<string, number>
      total: number
    }[]
  }[]
  tindak_lanjut: { kode: string; sudah: number; belum: number }[]
}

export type ReportType = "5.3b" | "5.3c" | "5.3d" | "5.5c" | "5.5d" | "5.5e"
