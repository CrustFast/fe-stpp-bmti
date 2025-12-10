import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportData } from "./types"

export const generate53c = (doc: jsPDF, data: ReportData, options: { year: string, periodLabel: string, logoImg: HTMLImageElement | null }) => {
  const { periodLabel, year: yearLabel, logoImg } = options

  // --- Kop Surat (Similar to 5.3b but with "Tindakan Korektif") ---
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
        { content: 'F-8.5.2-02', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 3: PENGADUAN MASYARAKAT + Edisi/Revisi
      [
        { content: 'Edisi/Revisi', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'A / 3', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 4: Tindakan Korektif + Tanggal
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
      // Row 5: Tindakan Korektif + Halaman
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

  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LAPORAN MONEV PENANGANAN PENGADUAN MASYARAKAT", 105, currentY, { align: "center" })
  currentY += 6
  doc.text("BBPPMPV BMTI", 105, currentY, { align: "center" })
  currentY += 6

  // Format period label for title (e.g., "Bulan April 2024" or "Triwulan 1 2025")
  // Since we use period/year, we'll display that.
  doc.text(`${periodLabel} ${yearLabel}`, 105, currentY, { align: "center" })
  currentY += 10

  // Table Content (Placeholder Data)
  const tableBody = [
    [
      "SKM9",
      "",
      "Lebih banyak lagi pelatihan pelatihan untuk pengajar",
      "",
      "",
      "Mengajukan pelatihan khusus untuk pengajar",
      "Pengajar tidak menguasai materi",
      "Memberikan kesempatan bagi pengajar untuk mengevaluasi dan meningkatkan kompetensinya"
    ],
    [
      "SKM9",
      "",
      "Mohon untuk kawasan asrama ditambah smoking area",
      "",
      "",
      "Mengajukan tempat khusus merokok",
      "",
      ""
    ],
    [
      "SKM9",
      "07-03-2024",
      "Waktu pelatihan bisa di perpanjang lagi",
      "ELE",
      "07-03-2024",
      "",
      "",
      ""
    ]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        "Kode",
        "Tgl. Aduan",
        "Uraian Ketidaksesuaian",
        "Kode Unit",
        "Tgl. Korektif",
        "Koreksi",
        "Analisis Penyebab",
        "Tindakan Korektif"
      ]
    ],
    body: tableBody,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 7,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      valign: 'top'
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [230, 230, 230], // Light gray header
      textColor: [0, 0, 0],
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // Kode
      1: { cellWidth: 15, halign: 'center' }, // Tgl Aduan
      2: { cellWidth: 'auto' },               // Uraian
      3: { cellWidth: 10, halign: 'center' }, // Kode Unit
      4: { cellWidth: 15, halign: 'center' }, // Tgl Korektif
      5: { cellWidth: 25 },                   // Koreksi
      6: { cellWidth: 25 },                   // Analisis Penyebab
      7: { cellWidth: 30 }                    // Tindakan Korektif
    }
  })

  doc.setFontSize(9)
  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 5
  doc.text("Catatan :", 14, currentY)

  // Signatures
  currentY += 20

  // Date
  const date = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  doc.text(`Cimahi, ${date}`, 105, currentY, { align: 'center' }) // Centered roughly? No, image shows it centered relative to page or right aligned? 
  // Image shows "Cimahi, Mei 2024" centered on the page.

  currentY += 10

  // Left Signature
  const leftX = 30
  doc.text("Kepala Penjab", leftX, currentY)
  currentY += 5
  doc.text("Tata Usaha dan Rumah Tangga", leftX, currentY)

  // Right Signature
  const rightX = 140
  // Reset Y for right signature to align with left
  let rightY = currentY - 5
  doc.text("Kepala Bagian Tata Usaha", rightX, rightY)

  // Space for signatures
  currentY += 30
  rightY += 30

  // Names and NIPs
  doc.text("Estu Setiawati, S.E.,M.Ak", leftX, currentY)
  doc.text("Wanto, M.Eng", rightX, rightY)

  currentY += 5
  rightY += 5

  doc.text("NIP. 197204022004122001", leftX, currentY)
  doc.text("NIP. 197204022004121001", rightX, rightY)

  doc.save(`5.3c Laporan Monev ${periodLabel} ${yearLabel}.pdf`)
}
