"use server";

import { revalidatePath } from "next/cache";

export const API_URL = 
  process.env.NODE_ENV === "production"
    ? "https://api.sigap.kemdungan.go.id"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function submitLaporanDumas(formData: FormData) {
  const klasifikasi = formData.get('klasifikasi_laporan');

  let endpointPath = "/api/laporan/pengaduan";
  if (klasifikasi === 'permintaan-informasi' || klasifikasi === 'permintaan_informasi') {
    endpointPath = "/api/laporan/permintaan-informasi";
  } else if (klasifikasi === 'saran') {
    endpointPath = "/api/laporan/saran";
  }

  console.log("Mengirim ke backend:", API_URL + endpointPath);

  // console.log("Mengirim ke backend:", API_URL + "/api/laporan/dumas");
  // console.log("Data yang dikirim:");
  // for (const [key, value] of formData.entries()) {
  //   if (value instanceof File && value.size > 0) {
  //     console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
  //   } else {
  //     console.log(`  ${key}: ${value}`);
  //   }
  // }

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

  revalidatePath("/laporan/dumas");
  return result;
}