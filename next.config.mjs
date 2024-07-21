/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // Don't attempt to resolve 'tls' module on the client side
  //     // config.resolve.fallback = {
  //     //   ...config.resolve.fallback,
  //     //   tls: false,
  //     //   net: false,
  //     //   fs: false,
  //     //   child_process: false,
  //     // };
  //   }
  //   return config;
  // },
};

export default nextConfig;
