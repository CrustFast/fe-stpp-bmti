export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export const getPeriodLabel = (p?: string) => {
  if (!p || p === "all") return "SETAHUN PENUH"
  if (p === "q1") return "TRIWULAN 1 (JANUARI - MARET)"
  if (p === "q2") return "TRIWULAN 2 (APRIL - JUNI)"
  if (p === "q3") return "TRIWULAN 3 (JULI - SEPTEMBER)"
  if (p === "q4") return "TRIWULAN 4 (OKTOBER - DESEMBER)"
  return p.toUpperCase()
}
