import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    error?: string
    user: {
      id: string
      email: string
      name: string
    } & DefaultSession["user"]
  }
  interface User {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type: string
    id: string
    email: string
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    expiresAt: number
    error?: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}