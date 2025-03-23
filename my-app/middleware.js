import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Nie przechwytuj żądań do statycznych plików i API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Obsługa dynamicznej trasy /orders/[id]
  if (pathname.startsWith('/orders/') && pathname !== '/orders/') {
    const segments = pathname.split('/');
    
    if (segments.length === 3 && !isNaN(parseInt(segments[2]))) {
      // Mamy prawidłowe ID zamówienia
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
  ],
}; 