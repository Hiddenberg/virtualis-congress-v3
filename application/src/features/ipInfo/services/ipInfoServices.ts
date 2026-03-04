import { headers } from "next/headers";
import ipInfo from "@/libs/ipInfo";
import "server-only";

export async function getIpAddressFromHeaders() {
   const headersStore = await headers();

   const ipAddress = headersStore.get("CF-Connecting-IP") ?? headersStore.get("X-Forwarded-For") ?? headersStore.get("X-Real-IP");

   return ipAddress;
}

export async function getIpInfoFromHeaders() {
   const ipAddress = await getIpAddressFromHeaders();

   if (!ipAddress) {
      return null;
   }

   const ipInfoResponse = await ipInfo.lookupIp(ipAddress);

   return ipInfoResponse;
}
