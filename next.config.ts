import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.

const revision = process.env.VERCEL_GIT_COMMIT_SHA || crypto.randomUUID();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; connect-src 'self' https://openrss.vercel.app",
          },
        ],
      },
    ]
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

export default withSerwist(nextConfig);
