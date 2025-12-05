"use server";

import { revalidatePath } from "next/cache";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://fe-stpp-bmti.vercel.app"
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

export async function submitLaporanBenturan(formData: FormData) {
  const endpointPath = "/api/laporan/benturan-kepentingan";
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
  revalidatePath("/laporan/benturan-kepentingan");
  return result;
}

export async function submitLaporanDumas(formData: FormData) {
  const klasifikasi = formData.get('klasifikasi_laporan');

  const endpointPath = "/api/laporan/dumas";
  // if (klasifikasi === 'permintaan-informasi' || klasifikasi === 'permintaan_informasi') {
  //   endpointPath = "/api/laporan/permintaan-informasi";
  // } else if (klasifikasi === 'saran') {
  //   endpointPath = "/api/laporan/saran";
  // }

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

  revalidatePath("/laporan/dumas");
  return result;
}
