import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
   reactCompiler: true,
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
};

export default nextConfig;
