/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV !== "development" ? "export" : "standalone",
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
    loader: 'custom',
    loaderFile: '/src/app/files/[...path]/route.ts',
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: 'http://localhost/ppdb-copy/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
