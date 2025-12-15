import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportData } from "./types"

export const generate55e = (doc: jsPDF, data: ReportData, options: { year: string, periodLabel: string, logoImg: HTMLImageElement | null }) => {
  const { periodLabel, year: yearLabel, logoImg } = options

  // --- Kop Surat ---
  autoTable(doc, {
    startY: 10,
    theme: 'grid',
    head: [],
    body: [
      // Baris 1: Logo 
      [
        {
          content: '',
          styles: { minCellWidth: 25, halign: 'center', valign: 'middle' }
        },
        {
          content: 'KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN\nBALAI BESAR PENGEMBANGAN PENJAMINAN MUTU PENDIDIKAN VOKASI\nBIDANG MESIN DAN TEKNIK INDUSTRI',
          colSpan: 3,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 10, cellPadding: 2 }
        }
      ],
      // Baris 2: Judul Utama + Kode Dokumen
      [
        {
          content: 'BENTURAN KEPENTINGAN',
          colSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 12 }
        },
        { content: 'Kode Dok.', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'F-8.5.2-03', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 3: Sub Judul + Edisi
      [
        {
          content: 'Rekapitulasi Tindakan Korektif',
          colSpan: 2,
          rowSpan: 3,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 12 }
        },
        { content: 'Edisi/Revisi', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'A / 3', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 4: Tanggal
      [
        { content: 'Tanggal', styles: { fontSize: 8, valign: 'middle' } },
        { content: '2 Mei 2014', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 5: Halaman
      [
        { content: 'Halaman', styles: { fontSize: 8, valign: 'middle' } },
        { content: '1 dari 2', styles: { fontSize: 8, valign: 'middle' } }
      ]
    ],
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      font: "times"
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 }
    },
    didDrawCell: (data) => {
      if (data.row.index === 0 && data.column.index === 0 && logoImg) {
        const dim = data.cell.height - 4;
        const x = data.cell.x + (data.cell.width - dim) / 2;
        const y = data.cell.y + 2;
        doc.addImage(logoImg, 'PNG', x, y, dim, dim)
      }
    }
  })

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  let currentY = doc.lastAutoTable.finalY + 10



  // Isi Tabel (Kosong)
  const tableBody = [
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        "Kode.",
        "Jenis Penyimpangan/\nKetidaksesuaian/Keluhan",
        "Penyebab",
        "Tindakan Korektif",
        "Tinjauan",
        "Kesimpulan"
      ]
    ],
    body: tableBody,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      valign: 'top',
      minCellHeight: 10
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255], // Latar belakang putih
      textColor: [0, 0, 0], // Teks hitam untuk header
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // Kode
      1: { cellWidth: 40 }, // Jenis Penyimpangan
      2: { cellWidth: 40 }, // Penyebab
      3: { cellWidth: 40 }, // Tindakan Korektif
      4: { cellWidth: 25 }, // Tinjauan
      5: { cellWidth: 'auto' } // Kesimpulan
    }
  })

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 20

  // --- Tanda Tangan ---
  // Pastikan ada ruang untuk tanda tangan
  if (currentY + 40 > doc.internal.pageSize.height - 20) {
    doc.addPage()
    currentY = 20
  }

  const date = new Date().getDate()
  const month = new Date().toLocaleDateString('id-ID', { month: 'long' })
  const year = new Date().getFullYear().toString()

  // Reset font ke normal untuk tanda tangan
  doc.setFont("times", "normal")
  doc.setTextColor(0, 0, 0)

  // Blok Tanda Tangan (Sisi Kanan)
  const signatureX = 120

  doc.text(`Cimahi, ${date} ${month} ${year}`, signatureX, currentY)
  currentY += 5
  doc.text("Koordinator Penguatan Pengawasan", signatureX, currentY)
  currentY += 30

  doc.text("Tinneke Mingkid", signatureX, currentY)
  currentY += 5
  doc.text("NIP.", signatureX, currentY)

  doc.save(`5.5e Laporan Tinjut Benturan Kepentingan ${periodLabel} ${yearLabel}.pdf`)
}
