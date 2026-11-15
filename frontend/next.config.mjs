/** @type {import('next').NextConfig} */
const rawBackend = (process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/+$/, "");
const destination = rawBackend.endsWith("/api/v1") ? `${rawBackend}/:path*` : `${rawBackend}/api/v1/:path*`;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination,
      },
    ];
  },
};

export default nextConfig;
