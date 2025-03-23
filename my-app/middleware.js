import { NextResponse } from 'next/server';

export function middleware(request) {
  // Nie przechwytuj żądań do statycznych plików i API
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Wyklucz wszystkie ścieżki, które powinny być obsługiwane jako statyczne pliki:
     * - API routes, static files, images, public assets
     * - Dołącz wszystkie ścieżki, które powinny przechodzić przez Next.js
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 