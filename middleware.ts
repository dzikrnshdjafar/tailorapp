// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware untuk mengecek autentikasi
export function middleware(req: NextRequest) {
  // Ambil token dari cookie (contoh menggunakan JWT token)
  const token = req.cookies.get('token')?.value;

  // Jika pengguna belum login dan mencoba mengakses halaman /customers
  if (!token && req.nextUrl.pathname.startsWith('/customers')) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika sudah login, lanjutkan
  return NextResponse.next();
}

// Tentukan halaman mana saja yang butuh autentikasi
export const config = {
  matcher: ['/customers'],
};
