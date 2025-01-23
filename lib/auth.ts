
import CredentialsProvider from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth"
import { LoginSchema } from "@/lib/validations/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
  }

  interface Session {
    maxAge?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google, CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      rememberMe: { label: "Remember Me", type: "checkbox" },
    },
    async authorize(credentials) {
      if (!credentials) return null;

      const rememberB = credentials.rememberMe === "true";

      const validatedFields = LoginSchema.safeParse({
        email: credentials.email,
        password: credentials.password,
        rememberMe: rememberB,
      });

      // If any form fields are invalid, return early
      if (!validatedFields.success) {
        return null;
      }

      const { email, password, rememberMe } = validatedFields.data;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
      }

      return { ...user, rememberMe };
    }
  })],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 24 * 60 * 60, // Default to 1 day
    updateAge: 24 * 60 * 60, // Default to 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rememberMe = user.rememberMe;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.rememberMe) {
        session.maxAge = 7 * 24 * 60 * 60; // 7 days
      } else {
        session.maxAge = 24 * 60 * 60; // 1 day
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});




