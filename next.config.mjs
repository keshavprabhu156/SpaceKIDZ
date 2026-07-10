/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for the Docker image (see Dockerfile)
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  // Three.js + drei ship untranspiled ESM; keep them out of the server bundle warnings
  transpilePackages: ["three"],
  images: {
    // Branding/curriculum assets will be served from /public or cloud storage later.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
