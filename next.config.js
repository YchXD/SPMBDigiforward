/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "smkantartika2-sda.sch.id" },
      { protocol: "https", hostname: "ppdb.telkomschools.sch.id" },
      { protocol: "https", hostname: "radarjatim.id" },
      { protocol: "https", hostname: "smaantarda.sch.id" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "files.catbox.moe" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: 'http://localhost/ppdb-copy/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
