import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportData } from "./types"

export const generate55c = (doc: jsPDF, data: ReportData, options: { year: string, periodLabel: string, logoImg: HTMLImageElement | null }) => {
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
      // Row 2: BENTURAN KEPENTINGAN + Kode Dok
      [
        {
          content: 'BENTURAN KEPENTINGAN',
          colSpan: 2,
          rowSpan: 2,
          styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 14 }
        },
        { content: 'Kode Dok.', styles: { fontSize: 8, valign: 'middle' } },
        { content: 'F-8.5.2-01', styles: { fontSize: 8, valign: 'middle' } }
      ],
      // Row 3: BENTURAN KEPENTINGAN + Edisi/Revisi
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

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  let currentY = doc.lastAutoTable.finalY + 10

  // Title
  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LAPORAN BENTURAN KEPENTINGAN", 105, currentY, { align: "center" })
  currentY += 6

  // Subtitle (Black)
  // "PERIODE SETAHUN PENUH 2025" - Hardcoded as per request or dynamic? 
  // User said "teks PERIODE SETAHUN PENUH 2025 buat warna hitam saja". 
  // I will use the dynamic year but keep the text format.
  doc.setTextColor(0, 0, 0)
  doc.text(`PERIODE SETAHUN PENUH ${yearLabel}`, 105, currentY, { align: "center" })
  currentY += 10

  // Intro Text
  doc.setFont("times", "normal")
  doc.setFontSize(11)
  const introText = "Dalam rangka membangun kerjasama yang harmonis dan meningkatkan kualitas kelembagaan, kegiatan kelembagaan tidak terlepas dari hubungan dan interaksi dengan para pemangku kepentingan serta pihak-pihak lainnya. Dalam menjalankan hubungan dan interaksi tersebut, terdapat potensi terjadinya situasi benturan kepentingan (conflict of interests) di antara masing-masing pihak. Benturan kepentingan adalah situasi atau kondisi dimana Pegawai Aparatur Sipil Negara di lingkungan BBPPMPV BMTI dan/atau pihak ketiga memiliki atau patut diduga memiliki kepentingan pribadi terhadap setiap penggunaan wewenang dalam kedudukan atau jabatannya, sehingga dapat mempengaruhi kualitas keputusan dan/atau tindakannya.  BBPPMPV BMTI telah mengimplementasikan penanganan benturan kepentingan melalui penandatanganan Surat Pernyataan Potensi Benturan Kepentingan Pejabat Struktural, Tim Kerja, Penanggungjawab dan semua pegawai.\n\nBenturan kepentingan tercantum dalam Undang-Undang Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan. Disebutkan pada Pasal 1 ayat 14, konflik kepentingan adalah kondisi pejabat pemerintahan yang memiliki kepentingan pribadi untuk menguntungkan diri sendiri dan/atau orang lain dalam penggunaan wewenang sehingga dapat mempengaruhi netralitas dan kualitas keputusan dan/atau tindakan yang dibuat dan/atau dilakukannya.\n\nDengan menyampaikan benturan yang teridentifikasi, manajemen BBPPMPV BMTI dapat mengambil langkah-langkah yang diperlukan untuk memperbaiki sistem atau prosedur yang ada. Ini dapat meningkatkan efisiensi dan efektivitas kerja, serta memperkuat hubungan antara organisasi dengan stakeholder-nya.  Dengan demikian, laporan benturan kepentingan bukan hanya sekadar sarana untuk menyampaikan keluhan atau masalah, tetapi juga merupakan salah satu instrumen yang penting dalam memperkuat tata kelola organisasi dan memastikan bahwa BBPPMPV BMTI beroperasi dengan prinsip-prinsip yang transparan, akuntabel, dan bertanggung jawab.   Berikut adalah rincian laporan benturan kepentingan di BBPPMPV BMTI:"

  const splitIntro = doc.splitTextToSize(introText, 180)
  doc.text(splitIntro, 14, currentY)
  currentY += (splitIntro.length * 5) + 10

  // --- Table 1: Saluran Pengaduan ---
  doc.setFont("times", "bold")
  doc.text("1. Saluran pengaduan yang digunakan", 14, currentY)
  currentY += 5

  const table1Data = [
    ["WBS", "Kemendikbudristek", ""],
    ["KNS", "Melalui Aplikasi KONFES", ""],
    ["SPI", "Melalui isian form BK ke tim SPI", ""],
    ["", "Total", ""]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [["Kode", "Saluran Pengaduan", "Jumlah"]],
    body: table1Data,
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
      if (data.row.index === table1Data.length - 1) {
        data.cell.styles.fontStyle = "bold"
        data.cell.styles.halign = "center"
      }
    }
  })

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 10

  // --- Table 2: Klasifikasi Pengaduan ---
  doc.text("2. Klasifikasi Pengaduan dan Rekapitulasi Laporan", 14, currentY)
  currentY += 5

  const table2Data = [
    ["BK01", "Kebijakan yang berpihak akibat pengaruh/hubungan dekat/ketergantungan/pemberian gratifikasi;", ""],
    ["BK02", "Pemberian izin yang diskriminatif;", ""],
    ["BK03", "Pengangkatan pegawai berdasarkan hubungan dekat/balas jasa/rekomendasi/pengaruh dari pejabat pemerintah;", ""],
    ["BK04", "Pemilihan partner/ rekanan kerja berdasarkan keputusan yang tidak profesional;", ""],
    ["BK05", "Melakukan komersialisasi pelayanan publik;", ""],
    ["BK06", "Penggunaan asset dan informasi rahasia untuk kepentingan pribadi/ golongan;", ""],
    ["BK07", "Pengawas ikut menjadi bagian dari pihak yang diawasi;", ""],
    ["BK08", "Melakukan pengawasan atau penilaian atas pengaruh pihak lain dan tidak sesuai norma, standar, dan prosedur;", ""],
    ["BK09", "Menjadi bagian dari pihak yang memiliki kepentingan atas sesuatu yang dinilai", ""],
    ["BK10", "Putusan/ Penetapan Pengadilan yang berpihak akibat pengaruh/ hubungan dekat/ ketergantungan/ pemberian gratifikasi.", ""],
    ["BK11", "Benturan Kepentingan lainnya : Sebutkan ...............................................................", ""],
    ["", "Total", ""]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [["Kode", "Jenis Pengaduan", "Jumlah"]],
    body: table2Data,
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
      0: { cellWidth: 20, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 30, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.row.index === table2Data.length - 1) {
        data.cell.styles.fontStyle = "bold"
        data.cell.styles.halign = "center"
      }
    }
  })

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 10

  // --- Table 3: Tindak Lanjut ---
  if (currentY > 200) {
    doc.addPage()
    currentY = 20
  }

  doc.text("3. Tindak Lanjut Penanganan Benturan Kepentingan", 14, currentY)
  currentY += 5

  const table3Data = [
    ["BK01", "", "", "", ""],
    ["BK02", "", "", "", ""],
    ["BK03", "", "", "", ""],
    ["BK04", "", "", "", ""],
    ["BK05", "", "", "", ""],
    ["BK06", "", "", "", ""],
    ["BK07", "", "", "", ""],
    ["BK08", "", "", "", ""],
    ["BK09", "", "", "", ""],
    ["BK10", "", "", "", ""],
    ["BK11", "", "", "", ""],
  ]

  autoTable(doc, {
    startY: currentY,
    head: [["Kode", "Uraian Bentuk Kepentingan", "Unit Terkait", "Penyebab", "Prosedur Penanganan"]],
    body: table3Data,
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
      1: { cellWidth: "auto" },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    }
  })

  // @ts-expect-error: jspdf-autotable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 20

  // --- Signature ---
  // Ensure space for signature
  if (currentY + 40 > doc.internal.pageSize.height - 20) {
    doc.addPage()
    currentY = 20
  }

  // Date (Black)
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.setTextColor(0, 0, 0)
  doc.text(`Cimahi, ${date}`, 140, currentY)
  currentY += 5

  doc.text("Ketua SPI", 140, currentY)
  currentY += 30

  doc.text("Tinneke Mingkid", 140, currentY)

  doc.save(`5.5c Laporan Benturan Kepentingan ${periodLabel} ${yearLabel}.pdf`)
}
