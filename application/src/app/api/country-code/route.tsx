import type { NextRequest } from "next/server";
import ipInfo from "@/libs/ipInfo";

export async function GET(request: NextRequest) {
   const cloudflareIPHeader = request.headers.get("CF-Connecting-IP");

   if (!cloudflareIPHeader) {
      return Response.json({
         status: "ok",
         countryCode: null,
      });
   }

   const { countryCode } = await ipInfo.lookupIp(cloudflareIPHeader);

   return Response.json({
      status: "ok",
      countryCode: countryCode,
   });
}
