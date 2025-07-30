
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // Docker'daki .NET API URL’i
      },
    ];
  }, 
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

module.exports = nextConfig;
