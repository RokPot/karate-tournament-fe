const isSpa = process.env.RENDERING === "spa";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

let remotePatterns;

if (!isSpa && !!process.env.NEXT_IMAGE_REMOTE_PATTERNS) {
  remotePatterns = process.env.NEXT_IMAGE_REMOTE_PATTERNS.split(",").map((hostname) => ({
    hostname: hostname.trim(),
  }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * @see https://nextjs.org/docs/api-reference/next.config.js/configuring-the-build-id
   * @returns {Promise<string>}
   */
  generateBuildId: async () => {
    // the build id should be linked to the git sha
    return process.env.NEXT_PUBLIC_RELEASE || "unset";
  },
  output: isSpa ? "export" : "standalone",
  images: {
    unoptimized: isSpa, // set this to false when output isn't static
    // remotePatterns are required when using SSR
    remotePatterns,
  },
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
