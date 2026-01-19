import "server-only";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import ipInfo from "@/libs/ipInfo";

export async function getCountryCodeFromRequest(request: NextRequest) {
   if (process.env.NODE_ENV === "development") {
      return "MX";
   }

   const cloudflareIPHeader = request.headers.get("CF-Connecting-IP");
   if (!cloudflareIPHeader) {
      return null;
   }

   const { countryCode } = await ipInfo.lookupIp(cloudflareIPHeader);

   return countryCode;
}

export async function getIpInfoFromHeaders() {
   const headersStore = await headers();

   const cloudflareIPHeader = headersStore.get("CF-Connecting-IP");
   if (!cloudflareIPHeader) {
      return null;
   }

   const ipInfoResponse = await ipInfo.lookupIp(cloudflareIPHeader);

   return ipInfoResponse;
}
