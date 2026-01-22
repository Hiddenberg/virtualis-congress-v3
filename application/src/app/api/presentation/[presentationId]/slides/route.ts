import { NextResponse } from "next/server";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";

export async function GET(_request: Request, { params }: { params: Promise<{ presentationId: string }> }) {
   const { presentationId } = await params;
   const presentationSlides = await getPresentationSlidesById(presentationId);
   const response = NextResponse.json(presentationSlides);
   return response;
}
