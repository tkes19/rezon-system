/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Eksportowanie aplikacji jako statycznych plików HTML
  images: {
    unoptimized: true, // Nieoptymalizowane obrazy dla eksportu statycznego
  },
  trailingSlash: true, // Dodanie ukośnika na końcu URL
  distDir: 'out',
  // To konieczne, aby obsługiwać dynamiczne ścieżki w eksporcie statycznym
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/orders': { page: '/orders' },
      '/orders/1': { page: '/orders/[id]', query: { id: '1' } },
      '/orders/2': { page: '/orders/[id]', query: { id: '2' } },
      '/orders/3': { page: '/orders/[id]', query: { id: '3' } },
      // Możesz dodać więcej predefiniowanych ID dla zamówień, które na pewno istnieją
    }
  },
}

module.exports = nextConfig 