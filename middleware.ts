import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define role types
type Role = "ADMIN" | "USER" | "PREMIUMUSER";

// Extend the token type if needed
interface Token {
  role?: Role;
}

// Define role-based access paths
const rolePaths: Record<Role, RegExp> = {
  ADMIN: /^\/dashboard(\/.*)?$/,
  USER: /^\/main\/user(\/.*)?$/,  
  PREMIUMUSER: /^\/main\/premium(\/.*)?$/,
};

// Helper function to redirect based on user role
const redirectToRolePath = (role: Role, req: NextRequest) => {
  const roleRedirects: Record<Role, string> = {
    ADMIN: "/dashboard",
    USER: "/main/user/files",
    PREMIUMUSER: "/main/premium",
  };

  return NextResponse.redirect(new URL(roleRedirects[role] || "/403", req.url));
};

// Middleware function
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;

  // Redirect to login if no token is found
  if (!token || !token.role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token.role;
  const requestedPath = req.nextUrl.pathname;

  // Check role-based access
  if (rolePaths[userRole]?.test(requestedPath)) {
    return NextResponse.next(); // Allow access
  }

  // Redirect to the role's base path or deny access if role/path mismatch
  return redirectToRolePath(userRole, req);
}

// Define paths where middleware should run
export const config = {
  matcher: [
    "/dashboard/:path*", // Matches admin paths
    "/main/user/:path*", // Matches user paths
    "/main/premium/:path*", // Matches premium user paths
  ],
};
