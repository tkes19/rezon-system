/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfiguracja dla Next.js 15.2.3
  experimental: {
    // Opcje eksperymentalne zgodne z Next.js 15
    typedRoutes: true,
  },
  // Konfiguracja podstawowa
  reactStrictMode: true,
  // Opcje dla wdrożenia Netlify
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Wyłączenie source maps w produkcji dla lepszej wydajności
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 