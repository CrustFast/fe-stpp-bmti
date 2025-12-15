import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { type JWT } from "next-auth/jwt"

const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
async function refreshAccessToken(token: JWT) {
  try {
    console.log("Refreshing access token...");
    if (!token.refreshToken) {
      console.error("RefreshAccessTokenError: Missing refresh token");
      throw new Error("Missing refresh token");
    }
    const response = await fetch(`${API_URL}/api/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    })
    const text = await response.text()
    let refreshedTokens
    try {
      refreshedTokens = JSON.parse(text)
    } catch {
      console.error("RefreshAccessTokenError: Invalid JSON response", text)
      throw new Error("Invalid JSON response from refresh token endpoint")
    }
    if (!response.ok) {
      throw refreshedTokens
    }
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + (refreshedTokens.expires_in * 1000),
    }
  } catch (error) {
    console.log("RefreshAccessTokenError", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
console.log("Loading NextAuth configuration...");
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data

          try {
            const res = await fetch(`${API_URL}/api/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            const text = await res.text();
            let user;
            try {
              user = JSON.parse(text);
            } catch {
              console.error("LoginError: Invalid JSON response", text);
              return null;
            }
            console.log("Login response:", user);
            if (res.ok && user.access_token) {
              return {
                id: email,
                name: "Admin",
                email: email,
                access_token: user.access_token,
                refresh_token: user.refresh_token,
                expires_in: user.expires_in,
                token_type: user.token_type,
              }
            }
          } catch (e) {
            console.error("Login error", e)
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback: Initial login", {
          expires_in: user.expires_in,
          computed_expiresAt: Date.now() + (user.expires_in * 1000)
        });
        return {
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          expiresAt: Date.now() + (user.expires_in * 1000),
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      }

      console.log("JWT Callback: Checking expiration", {
        now: Date.now(),
        expiresAt: token.expiresAt,
        isValid: Date.now() < token.expiresAt
      });

      if (Date.now() < token.expiresAt) {
        return token
      }
      console.log("JWT Callback: Token expired, refreshing...");
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      if (token.user) {
        session.user = { ...session.user, ...token.user }
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const hasRefreshError = auth?.error === "RefreshAccessTokenError";
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn && !hasRefreshError) return true;
        return false;
      } else if (isLoggedIn && !hasRefreshError && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
})