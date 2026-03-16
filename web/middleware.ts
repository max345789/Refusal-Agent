import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public marketing mode by default.
// Set `NEXT_PUBLIC_ENABLE_APP=1` to expose the app/admin pages.
const ENABLE_APP = process.env.NEXT_PUBLIC_ENABLE_APP === '1';

const PROTECTED_PREFIXES = ['/dashboard', '/tickets', '/analytics', '/settings'];

export function middleware(req: NextRequest) {
  if (ENABLE_APP) return NextResponse.next();

  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set('mode', 'public');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/dashboard/:path*', '/tickets/:path*', '/analytics/:path*', '/settings/:path*'],
};
