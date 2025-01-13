import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,Google],
})

// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   providers: [
//     GitHub({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     Google({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // Ensures the redirect is within your app
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
// });
