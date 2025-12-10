import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportData } from "./types"

export const generate53d = (doc: jsPDF, data: ReportData, options: { year: string, periodLabel: string, logoImg: HTMLImageElement | null }) => {
  const { periodLabel, year: yearLabel, logoImg } = options

  // --- Kop Surat ---
  autoTable(doc, {
    startY: 10,
    theme: 'grid',
    head: [],
    body: [
      // Row 1: Logo 
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
      // Row 2: PENGADUAN MASYARAKAT + Kode Dok
      [
        {
          content: 'PENGADUAN MASYARAKAT',
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 14 }
        },
        { content: 'Kode Dok.', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'F-8.5.2-03', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 3: PENGADUAN MASYARAKAT + Edisi/Revisi
      [
        { content: 'Edisi/Revisi', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'A / 3', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 4: Rekapitulasi Tindakan Korektif + Tanggal
      [
        {
          content: 'Rekapitulasi Tindakan Korektif',
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontSize: 11, fontStyle: 'bold', textColor: [0, 0, 0] }
        },
        { content: 'Tanggal', styles: { fontSize: 8, valign: 'middle' } },
        { content: '2 Mei 2014', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 5: Rekapitulasi Tindakan Korektif + Halaman
      [
        { content: 'Halaman', styles: { fontSize: 8, valign: 'middle' } },
        { content: '1 dari 6', styles: { fontSize: 8, valign: 'middle' } }
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

  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LAPORAN TINDAK LANJUT PENGADUAN MASYARAKAT", 105, currentY, { align: "center" })
  currentY += 6
  doc.text("BBPPMPV BMTI", 105, currentY, { align: "center" })
  currentY += 6

  // PERIODE [MONTH YEAR]
  // Using periodLabel which might be "TRIWULAN 1" or "SETAHUN PENUH". 
  // If user wants specific month like "MARET 2024", we might need to adjust logic, but for now using available filters.
  doc.text(`PERIODE ${periodLabel} ${yearLabel}`, 105, currentY, { align: "center" })
  currentY += 10

  // Table Content (Placeholder Data matching columns)
  const tableBody = [
    [
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      ""
    ]
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
      valign: 'top'
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [230, 230, 220], // Beige/Light Gray
      textColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // Kode
      1: { cellWidth: 40 },                   // Jenis Penyimpangan
      2: { cellWidth: 30 },                   // Penyebab
      3: { cellWidth: 35 },                   // Tindakan Korektif
      4: { cellWidth: 30 },                   // Tinjauan
      5: { cellWidth: 30 }                    // Kesimpulan
    }
  })

  // Signatures
  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 20

  // Date
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  // Right aligned signature
  const rightX = 140

  doc.setFontSize(10)
  doc.setFont("times", "normal")
  doc.text(`Cimahi, ${date}`, rightX, currentY)
  currentY += 5
  doc.text("Penjab Pelayanan Publik", rightX, currentY)

  // Space for signature
  currentY += 30

  doc.text("Ipan Ilmansyah Hidayat", rightX, currentY)
  currentY += 5
  doc.text("NIP. 197512142002121002", rightX, currentY)

  doc.save(`5.3d Laporan Tinjut ${periodLabel} ${yearLabel}.pdf`)
}
