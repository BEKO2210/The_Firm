import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack workspace-root explizit setzen (sonst warnt Next 16 bei mehreren lockfiles).
  turbopack: { root: __dirname },
  experimental: {
    // Server Components lesen .firma/ direkt vom Filesystem.
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default nextConfig;
