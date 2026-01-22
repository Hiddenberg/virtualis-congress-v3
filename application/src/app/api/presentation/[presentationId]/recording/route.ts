import { NextResponse } from "next/server";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";

export async function GET(_request: Request, { params }: { params: Promise<{ presentationId: string }> }) {
   const { presentationId } = await params;

   const recording = await getPresentationRecordingByPresentationId(presentationId);
   const presentationSlides = await getPresentationSlidesById(presentationId);

   return NextResponse.json({
      recording,
      presentationSlides,
   });
}
