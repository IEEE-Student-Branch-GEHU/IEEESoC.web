/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js dynamic image optimization
  },
  // This tells Next.js to prefix all asset paths with your repository name
  basePath: '/IEEESoC.web',
  assetPrefix: '/IEEESoC.web/',
};

export default nextConfig;
