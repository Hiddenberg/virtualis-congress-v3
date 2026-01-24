import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
   reactCompiler: true,
   cacheComponents: true,
   poweredByHeader: false,
   images: {
      remotePatterns: [
         {
            hostname: "localhost",
            port: "8080",
         },
         {
            hostname: "res.cloudinary.com",
         },
         {
            hostname: "picsum.photos",
         },
      ],
   },
   experimental: {
      serverActions: {
         bodySizeLimit: "20mb",
      },
   },
};

export default nextConfig;
