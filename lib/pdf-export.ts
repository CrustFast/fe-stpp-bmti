import jsPDF from "jspdf"
import { ReportData, ReportType } from "./pdf/types"
import { loadImage, getPeriodLabel } from "./pdf/utils"
import { generate53b } from "./pdf/generate-53b"
import { generate53c } from "./pdf/generate-53c"
import { generate53d } from "./pdf/generate-53d"

export type { ReportData, ReportType }

export const generatePDF = async (data: ReportData, type: ReportType = "5.3b", options?: { year?: string, period?: string }) => {
  const doc = new jsPDF()

  const periodLabel = getPeriodLabel(options?.period)
  const yearLabel = options?.year || new Date().getFullYear().toString()

  // Logo Kemdikdasmen
  let logoImg: HTMLImageElement | null = null
  try {
    logoImg = await loadImage("/img/kemdikbud_logo.png")
  } catch (error) {
    console.error("Failed to load logo", error)
  }

  const generatorOptions = {
    year: yearLabel,
    periodLabel,
    logoImg
  }

  if (type === "5.3b") {
    generate53b(doc, data, generatorOptions)
  } else if (type === "5.3c") {
    generate53c(doc, data, generatorOptions)
  } else if (type === "5.3d") {
    generate53d(doc, data, generatorOptions)
  }
}
