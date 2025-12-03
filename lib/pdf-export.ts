import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ReportData {
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

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export const generatePDF = async (data: ReportData) => {
  const doc = new jsPDF()

  // Logo Kemdikdasmen
  let logoImg: HTMLImageElement | null = null
  try {
    logoImg = await loadImage("/img/kemdikbud_logo.png")
  } catch (error) {
    console.error("Failed to load logo", error)
  }

  // Kop Surat
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
        { content: 'F-8.5.2-01', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 3: PENGADUAN MASYARAKAT + Edisi/Revisi
      [
        { content: 'Edisi/Revisi', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'A / 3', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 4: Laporan Ketidaksesuaian + Tanggal
      [
        {
          content: 'Laporan Ketidaksesuaian',
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontSize: 11, fontStyle: 'bold', textColor: [0, 0, 0] }
        },
        { content: 'Tanggal', styles: { fontSize: 8, valign: 'middle' } },
        { content: '2 Mei 2014', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 5: Laporan Ketidaksesuaian + Halaman
      [
        { content: 'Halaman', styles: { fontSize: 8, valign: 'middle' } },
        { content: '1 dari 4', styles: { fontSize: 8, valign: 'middle' } }
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

  // @ts-ignore
  let currentY = doc.lastAutoTable.finalY + 10

  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LAPORAN PENGADUAN MASYARAKAT", 105, currentY, { align: "center" })
  currentY += 6
  doc.text("BBPPMPV BMTI", 105, currentY, { align: "center" })
  currentY += 6

  const periodText = data.period === "all" ? "SETAHUN PENUH" : `TW ${data.period.replace("q", "").toUpperCase()}`
  doc.text(`REKAP ${periodText} ${data.year}`, 105, currentY, { align: "center" })
  currentY += 10

  doc.setFont("times", "normal")
  doc.setFontSize(11)

  const text1 = "Pengaduan masyarakat adalah segala bentuk informasi atau komunikasi berupa pengaduan yang disampaikan oleh masyarakat, termasuk pegawai BBPPMPV BMTI ketika bertindak sebagai masyarakat umum yang menggunakan layanan. Pengaduan ini berkaitan dengan jenis layanan yang ada di BBPPMPV BMTI. Selain itu, pengaduan masyarakat juga merupakan salah satu cara untuk mendorong perbaikan dan perubahan positif di dalam organisasi."
  const text2 = "Dengan menyampaikan masalah atau kekurangan yang teridentifikasi, manajemen BBPPMPV BMTI dapat mengambil langkah-langkah yang diperlukan untuk memperbaiki sistem atau prosedur yang ada. Ini dapat meningkatkan efisiensi dan efektivitas kerja, serta memperkuat hubungan antara organisasi dengan stakeholder-nya. Dengan demikian, pengaduan masyarakat bukan hanya sekadar sarana untuk menyampaikan keluhan atau masalah, tetapi juga merupakan salah satu instrumen yang penting dalam memperkuat tata kelola organisasi dan memastikan bahwa BBPPMPV BMTI beroperasi dengan prinsip-prinsip yang transparan, akuntabel, dan bertanggung jawab. Berikut adalah rincian laporan pengaduan masyarakat di BBPPMPV BMTI:"

  const splitText1 = doc.splitTextToSize(text1, 180)
  doc.text(splitText1, 14, currentY)
  currentY += (splitText1.length * 5) + 5

  const splitText2 = doc.splitTextToSize(text2, 180)
  doc.text(splitText2, 14, currentY)
  currentY += (splitText2.length * 5) + 10

  // --- 1. Saluran Pengaduan ---
  doc.setFont("times", "bold")
  doc.setFontSize(11)
  doc.text("1. Saluran pengaduan yang digunakan", 14, currentY)
  currentY += 5

  const saluranRows = data.saluran_pengaduan.map((item) => [
    item.kode,
    item.nama,
    item.jumlah,
  ])
  const totalSaluran = data.saluran_pengaduan.reduce((acc, item) => acc + item.jumlah, 0)
  saluranRows.push(["", "Total", totalSaluran])

  autoTable(doc, {
    startY: currentY,
    head: [["Kode", "Saluran Pengaduan", "Jumlah"]],
    body: saluranRows,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 11,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0]
    },
    headStyles: {
      fontStyle: "bold",
      halign: "center",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 30, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.row.index === saluranRows.length - 1) {
        data.cell.styles.fontStyle = "bold"
      }
    },
  })

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 10

  // --- 2. Klasifikasi Pengaduan ---
  doc.text("2. Klasifikasi Pengaduan", 14, currentY)
  currentY += 5

  const klasifikasiRows = data.klasifikasi_pengaduan.map((item) => [
    item.no,
    item.kode,
    item.nama,
    item.jumlah,
  ])
  const totalKlasifikasi = data.klasifikasi_pengaduan.reduce((acc, item) => acc + item.jumlah, 0)
  klasifikasiRows.push(["", "", "Total", totalKlasifikasi])

  autoTable(doc, {
    startY: currentY,
    head: [["No", "Kode", "Jenis Pengaduan", "Jumlah"]],
    body: klasifikasiRows,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 11,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0]
    },
    headStyles: {
      fontStyle: "bold",
      halign: "center",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: "auto" },
      3: { cellWidth: 30, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.row.index === klasifikasiRows.length - 1) {
        data.cell.styles.fontStyle = "bold"
      }
    },
  })

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 10

  // --- 3. Pengaduan Masyarakat (Matrix) ---
  if (currentY > 200) {
    doc.addPage()
    currentY = 20
  }

  doc.text("3. Pengaduan Masyarakat", 14, currentY)
  currentY += 5

  const matrixHeaders = [
    "SKM1", "SKM2", "SKM3", "SKM4", "SKM5", "SKM6", "SKM7", "SKM8", "SKM9",
    "GRA", "BKP", "WBS", "TDB1", "TDB2", "TDB3"
  ]

  const matrixBody = []

  data.pengaduan_masyarakat.forEach(group => {
    matrixBody.push([{ content: group.group, colSpan: 18, styles: { fontStyle: 'bold', halign: 'left' } }])

    group.items.forEach(item => {
      const row = [
        item.kode,
        item.nama,
        ...matrixHeaders.map(code => item.counts[code] || 0),
        item.total
      ]
      matrixBody.push(row)
    })
  })

  // Total row
  const totalMatrixCounts: Record<string, number> = {}
  matrixHeaders.forEach(code => totalMatrixCounts[code] = 0)
  let grandTotalMatrix = 0

  data.pengaduan_masyarakat.forEach(group => {
    group.items.forEach(item => {
      matrixHeaders.forEach(code => {
        totalMatrixCounts[code] += (item.counts[code] || 0)
      })
      grandTotalMatrix += item.total
    })
  })

  const totalMatrixRow = [
    "",
    "Total per proses",
    ...matrixHeaders.map(code => totalMatrixCounts[code]),
    grandTotalMatrix
  ]
  matrixBody.push(totalMatrixRow)

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        { content: "Kode", rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: "Jenis Layanan", rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: "Kategori Pengaduan", colSpan: 15, styles: { halign: 'center' } },
        { content: "Total", rowSpan: 2, styles: { valign: 'middle', halign: 'center' } }
      ],
      matrixHeaders.map((_, i) => (i + 1).toString())
    ],
    body: matrixBody,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 7,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      cellPadding: 1,
      halign: 'center'
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "left" },
      1: { cellWidth: 20, halign: "left" },
      17: { cellWidth: 10, fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.row.index === matrixBody.length - 1) {
        data.cell.styles.fontStyle = "bold"
      }
      // @ts-ignore
      if (data.row.raw[0]?.colSpan) {
        data.cell.styles.halign = 'left'
      }
    }
  })

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 10

  // --- 4. Tindak Lanjut ---
  if (currentY > 230) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(11)
  doc.text("4. Tindak lanjut", 14, currentY)
  currentY += 5

  const tindakLanjutRows = data.tindak_lanjut.map(item => [
    item.kode,
    item.sudah,
    item.belum
  ])

  const totalSudah = data.tindak_lanjut.reduce((acc, item) => acc + item.sudah, 0)
  const totalBelum = data.tindak_lanjut.reduce((acc, item) => acc + item.belum, 0)
  tindakLanjutRows.push(["Total", totalSudah, totalBelum])

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        { content: "Kode", rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: "Tindak Lanjut", colSpan: 2, styles: { halign: 'center' } }
      ],
      ["Sudah", "Belum"]
    ],
    body: tindakLanjutRows,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 11,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0]
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 30, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.row.index === tindakLanjutRows.length - 1) {
        data.cell.styles.fontStyle = "bold"
      }
    }
  })

  // --- Keterangan & Signature ---
  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 10

  if (currentY > 150) {
    doc.addPage()
    currentY = 20
  }

  doc.setFont("times", "bold")
  doc.setFontSize(11)
  doc.text("Keterangan :", 14, currentY)
  currentY += 5

  doc.setFont("times", "normal")
  const keteranganItems = [
    "1. Kesesuaian persyaratan pelayanan",
    "2. Kemudahan prosedur",
    "3. Kecepatan pelayanan",
    "4. Biaya/tarif pelayanan",
    "5. Kesesuaian produk",
    "6. Perilaku petugas",
    "7. Kompetensi/kemampuan petugas",
    "8. Penanganan pengaduan",
    "9. Kualitas sarana dan prasarana"
  ]

  keteranganItems.forEach(item => {
    doc.text(item, 14, currentY)
    currentY += 5
  })

  currentY += 2
  doc.setFont("times", "bold")
  doc.text("3 Dosa Besar Dunia Pendidikan", 14, currentY)
  currentY += 5
  doc.setFont("times", "normal")
  doc.text("10. Kekerasan Seksual", 14, currentY)
  currentY += 5
  doc.text("11. Perundungan", 14, currentY)
  currentY += 5
  doc.text("12. Intoleransi", 14, currentY)

  // Tanda tangan
  currentY += 20

  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  doc.text(`Cimahi, ${date}`, 140, currentY)
  currentY += 30
  doc.text("Ipan Ilmansyah Hidayat", 140, currentY)

  doc.save("5.3b Laporan Pengaduan Masyarakat BBPPMPV BMTI.pdf")
}
