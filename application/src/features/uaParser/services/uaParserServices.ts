import { headers } from "next/headers";
import "server-only";
import { UAParser } from "ua-parser-js";

export async function getUserAgentInfoFromHeaders() {
   const headersList = await headers();
   const userAgent = headersList.get("user-agent");
   if (!userAgent) {
      return null;
   }

   const uaParserResponse = UAParser(userAgent);

   return uaParserResponse;
}
