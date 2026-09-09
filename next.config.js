/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sortie autonome : Next.js produit un serveur minimal dans .next/standalone,
  // avec les seules dependances reellement utilisees. C'est ce qui permet une
  // image Docker legere, sans embarquer tout node_modules.
  output: 'standalone',

  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
}

module.exports = nextConfig
