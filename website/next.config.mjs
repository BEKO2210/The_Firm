/** @type {import('next').NextConfig} */

// Dual-mode config:
//
//   `npm run dev`              → full dynamic dashboard (API routes, SSE, file reads).
//   `BUILD_TARGET=pages build` → static export for GitHub Pages (public overview).
//
// The CI workflow (.github/workflows/deploy-pages.yml) moves `app/api/`
// aside before running the static build, then restores it after.
const isPagesBuild = process.env.BUILD_TARGET === 'pages';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isPagesBuild ? '/the_firm' : '');

const nextConfig = {
  reactStrictMode: true,
  ...(isPagesBuild && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    basePath,
    assetPrefix: basePath || undefined,
  }),
  experimental: { serverActions: { bodySizeLimit: '5mb' } }
};

export default nextConfig;
