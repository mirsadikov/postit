import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import InstagramProvider from 'next-auth/providers/instagram'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/prisma/client'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
    })
  ],
} as NextAuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
