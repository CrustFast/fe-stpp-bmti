import NextAuth from "next-auth"
import { auth } from "@/auth"

export default auth((req) => {
  // todo: login function
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
