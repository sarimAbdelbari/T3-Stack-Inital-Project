import { handlers } from "@/lib/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers











// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import NextAuth, { type NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "../../../server/db";
// import { compare } from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // Google OAuth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     // Email/password auth
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Please enter your email and password");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           throw new Error("No user found");
//         }

//         const isValid = await compare(credentials.password, user.password);

//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         return user;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt", // Use JWT for session management
//   },
//   callbacks: {
//     // Add user ID to the JWT token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     // Add user ID to the session object
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin", // Custom sign-in page
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Required for production
// };

// export default NextAuth(authOptions);