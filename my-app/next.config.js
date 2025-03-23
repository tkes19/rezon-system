/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Eksportowanie aplikacji jako statycznych plików HTML
  images: {
    unoptimized: true, // Nieoptymalizowane obrazy dla eksportu statycznego
  },
  trailingSlash: true, // Dodanie ukośnika na końcu URL
}

module.exports = nextConfig 