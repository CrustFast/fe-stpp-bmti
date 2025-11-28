"use server";

import { revalidatePath } from "next/cache";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.sigap.kemdungan.go.id"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function submitLaporanGratifikasi(formData: FormData) {
  const endpointPath = "/api/laporan/gratifikasi";
  console.log("Mengirim ke backend:", API_URL + endpointPath);

  const startTime = Date.now();
  const res = await fetch(`${API_URL}${endpointPath}`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const duration = Date.now() - startTime;
  console.log(`Response ${res.status} ${res.statusText} dalam ${duration}ms`);

  const result = await res.json();
  console.log("Response dari Go:", result);

  if (!res.ok) {
    throw new Error(result.message || "Gagal mengirim laporan");
  }

  revalidatePath("/laporan/gratifikasi");
  return result;
}
