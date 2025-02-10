import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { LoginSchema } from "@/lib/validations/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface User {
    rememberMe?: boolean;
    role?: string;
  }

  interface Session {
    maxAge?: number;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    CredentialsProvider({
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

        
        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            role: true, // Include role
          },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }

        return { ...user, rememberMe };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 24 * 60 * 60, // Default to 1 day
    updateAge: 24 * 60 * 60, // Default to 1 day
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider) {
        const providerAccountId = account.providerAccountId;

        // Find an existing user by email
        let dbUser = await prisma.user.findUnique({
          where: { email: user?.email ?? undefined },
          include: { accounts: true }, // Include linked provider accounts
        });


        if (!dbUser) {
          // Create a new user if it doesn't exist
             const hashedPassword = await bcrypt.hash(providerAccountId, 10);
          
          dbUser = await prisma.user.create({
            data: {
              email:
                profile?.email ??
                `${account.provider}_${providerAccountId}@AcmeInc.com`,
              name: profile?.name,
              password: hashedPassword,
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId,
                },
              },
              role: "USER", // Assign default role for new OAuth users
            },
            include: {
              accounts: true, // Ensure accounts are included in the created user
            },
          });
        } else {
          // Check if the provider account is already linked
          const existingAccount = dbUser.accounts.find(
            (acc) =>
              acc.provider === account.provider &&
              acc.providerAccountId === providerAccountId
          );

          if (!existingAccount) {
            // Link the new provider account to the existing user
            await prisma.providerAccount.create({
              data: {
                provider: account.provider,
                providerAccountId,
                userId: dbUser.id,
              },
            });
          }
        }

        // Add role to the user object for token
        user.role = dbUser?.role;
        user.id = dbUser?.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role from user object
        token.rememberMe = user.rememberMe;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string; // Add role to session
      session.user.rememberMe = token.rememberMe as boolean; // Ensure rememberMe is passed
      session.user.id = token.id as string;
      session.maxAge = token.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
