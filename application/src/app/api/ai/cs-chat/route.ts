import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   const body = await request.json();

   console.log("[AI-CS-Chat API] Request body:", body);

   return NextResponse.json({
      text: "Testing response",
   });
}
