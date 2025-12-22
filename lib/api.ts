export const API_URL = process.env.API_URL || (process.env.NODE_ENV === "production"
  ? "https://fe-stpp-bmti.vercel.app"
  : "http://localhost:8080");

export const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "";