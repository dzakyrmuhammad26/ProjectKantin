/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Mempercepat loading gambar lokal di dev & build
  },
  async redirects() {
    return [
      {
        source: '/order',
        destination: '/customer',
        permanent: true,
      },
      {
        source: '/order/:path*',
        destination: '/customer/:path*',
        permanent: true,
      },
      {
        source: '/gerai',
        destination: '/stall/queue',
        permanent: true,
      },
      {
        source: '/gerai/antrean',
        destination: '/stall/queue',
        permanent: true,
      },
      {
        source: '/gerai/menu',
        destination: '/stall/menu',
        permanent: true,
      },
      {
        source: '/gerai/pesan',
        destination: '/stall/order',
        permanent: true,
      },
      {
        source: '/gerai/:path*',
        destination: '/stall/:path*',
        permanent: true,
      },
      {
        source: '/kasir',
        destination: '/cashier',
        permanent: true,
      },
      {
        source: '/kasir/:path*',
        destination: '/cashier/:path*',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/admin/gerai',
        destination: '/admin/stalls',
        permanent: true,
      },
      {
        source: '/admin/pengguna',
        destination: '/admin/users',
        permanent: true,
      },
      {
        source: '/admin/laporan',
        destination: '/admin/reports',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
