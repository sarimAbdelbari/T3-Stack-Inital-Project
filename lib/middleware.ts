// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { getCookie } from 'cookies-next/server';
// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation';

const prisma = new PrismaClient();
// if (!session) redirect('/login');



export async function middleware(request: NextRequest , response: NextResponse) {
    const sessionToken = await getCookie('session', { req: request, res: response });
    // const sessionProvider = await auth();

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate the session token (e.g., using Prisma or your auth library)
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });


  if (!session || new Date(session.expires) < new Date()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

// Protect all routes under /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};