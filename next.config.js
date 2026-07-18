/* eslint-disable @typescript-eslint/no-require-imports */
const bundleAnalyzer = require("@next/bundle-analyzer");
const createNextIntlPlugin = require("next-intl/plugin");

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Liara's Next.js image expects a standalone server. Keeping this in the
  // repository prevents its build script from generating a next.config.js
  // that would shadow the next-intl plugin configuration.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "motion"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
