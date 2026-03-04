import { NextResponse } from "next/server";
import { getUserAgentInfoFromHeaders } from "@/features/uaParser/services/uaParserServices";
import ipInfo from "@/libs/ipInfo";

export async function GET() {
   const ipInfoResponse = await ipInfo.lookupIp("162.120.185.226");
   const uaParserResponse = await getUserAgentInfoFromHeaders();
   return NextResponse.json({
      message: "Hello World",
      ipInfo: ipInfoResponse,
      uaParserResponse: uaParserResponse,
   });
}
