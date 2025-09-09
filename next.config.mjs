/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // ✅ Habilitar verificação de ESLint
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ Habilitar verificação de TypeScript
  },
  images: {
    unoptimized: false, // ✅ Otimizar imagens para produção
  },
}

export default nextConfig
