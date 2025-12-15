import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportData } from "./types"

export const generate55d = (doc: jsPDF, data: ReportData, options: { year: string, periodLabel: string, logoImg: HTMLImageElement | null }) => {
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
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 14 }
        },
        { content: 'Kode Dok.', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'F-8.5.2-02', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 3: Sub Judul + Edisi/Revisi
      [
        { content: 'Edisi/Revisi', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'A / 3', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 4: Tindakan Korektif + Tanggal
      [
        {
          content: 'Tindakan Korektif',
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontSize: 11, fontStyle: 'bold', textColor: [0, 0, 0] }
        },
        { content: 'Tanggal', styles: { fontSize: 8, valign: 'middle' } },
        { content: '2 Mei 2014', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Baris 5: Tindakan Korektif + Halaman
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

  // Judul
  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LAPORAN MONEV PENANGANAN BENTURAN KEPENTINGAN", 105, currentY, { align: "center" })
  currentY += 6
  doc.text("BBPPMPV BMTI", 105, currentY, { align: "center" })
  currentY += 6

  // Sub Judul (Hitam)
  doc.setTextColor(0, 0, 0)
  doc.text(`PERIODE ${periodLabel.toUpperCase()} TAHUN ${yearLabel}`, 105, currentY, { align: "center" })
  currentY += 10

  // Isi Tabel (Kosong sesuai permintaan)
  const tableBody = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        "Kode",
        "Uraian ketidaksesuaian",
        "Kode Unit",
        "Unit Terkait",
        "Koreksi",
        "Analisis Penyebab",
        "Tindakan Korektif"
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
      1: { cellWidth: 35 }, // Uraian
      2: { cellWidth: 15, halign: 'center' }, // Kode Unit
      3: { cellWidth: 25 }, // Unit Terkait
      4: { cellWidth: 35 }, // Koreksi
      5: { cellWidth: 35 }, // Analisis
      6: { cellWidth: 'auto' } // Tindakan
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

  const month = new Date().toLocaleDateString('id-ID', { month: 'long' })
  const year = new Date().getFullYear().toString()

  // Reset font ke normal untuk tanda tangan
  doc.setFont("times", "normal")
  doc.setTextColor(0, 0, 0)

  // Sisi Kiri: Tanggal
  doc.text(`Cimahi, ${month} ${year}`, 20, currentY)

  // Sisi Kanan: Penanda Tangan
  doc.text("Kepala Bagian Tata Usaha", 140, currentY)
  currentY += 30

  doc.text("Wanto, M.Eng", 140, currentY)
  currentY += 5
  doc.text("NIP. 197204022004121001", 140, currentY)

  doc.save(`5.5d Laporan Monev Benturan Kepentingan ${periodLabel} ${yearLabel}.pdf`)
}
