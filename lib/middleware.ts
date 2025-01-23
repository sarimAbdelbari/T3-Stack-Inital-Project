import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from '@/lib/auth';
export function middleware(req: NextRequest) {

  const session = auth();
  // Redirect to login if token is missing
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
