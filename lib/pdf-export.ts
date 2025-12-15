import jsPDF from "jspdf"
import { ReportData, ReportType } from "./pdf/types"
import { loadImage, getPeriodLabel } from "./pdf/utils"
import { generate53b } from "./pdf/generate-53b"
import { generate53c } from "./pdf/generate-53c"
import { generate53d } from "./pdf/generate-53d"

import { generate55c } from "./pdf/generate-55c"
import { generate55d } from "./pdf/generate-55d"
import { generate55e } from "./pdf/generate-55e"

export type { ReportData, ReportType }

export const generatePDF = async (data: ReportData, type: ReportType, options: { year: string, period?: string }) => {
  const doc = new jsPDF()

  // Memuat logo
  const logoUrl = "/img/kemdikbud_logo.png"
  const logoImg = await loadImage(logoUrl)

  const periodLabel = (options.period && options.period !== "all") ? `Triwulan ${options.period}` : "Setahun Penuh"

  switch (type) {
    case "5.3b":
      generate53b(doc, data, { year: options.year, periodLabel, logoImg })
      break
    case "5.3c":
      generate53c(doc, data, { year: options.year, periodLabel, logoImg })
      break
    case "5.3d":
      generate53d(doc, data, { year: options.year, periodLabel, logoImg })
      break
    case "5.5c":
      generate55c(doc, data, { year: options.year, periodLabel, logoImg })
      break
    case "5.5d":
      generate55d(doc, data, { year: options.year, periodLabel, logoImg })
      break
    case "5.5e":
      generate55e(doc, data, { year: options.year, periodLabel, logoImg })
      break
  }
}
