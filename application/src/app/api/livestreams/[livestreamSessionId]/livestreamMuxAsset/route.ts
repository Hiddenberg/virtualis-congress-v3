import { NextResponse } from "next/server";
import { getMuxLivestreamRecordByLivestreamSessionId } from "@/features/livestreams/services/muxLivestreamServices";

export async function GET(
   request: Request,
   { params }: { params: Promise<{ livestreamSessionId: string }> },
) {
   const { livestreamSessionId } = await params;

   const livestreamMuxAsset =
      await getMuxLivestreamRecordByLivestreamSessionId(livestreamSessionId);

   return NextResponse.json({
      data: livestreamMuxAsset,
   });
}
