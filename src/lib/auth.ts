import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { Profile } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: Profile & { id: string }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        // Find or create user
        let user = await db.profile.findUnique({
          where: { email: credentials.email },
        })

        if (!user && credentials.name) {
          user = await db.profile.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              userType: (credentials.userType as "AUTHOR" | "REVIEWER" | "BOTH") || "REVIEWER",
            },
          })
        }

        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await db.profile.findUnique({
          where: { id: token.sub },
        })
        if (user) {
          session.user = { ...user, id: user.id }
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "wadsworth-publishing-secret-key",
}
