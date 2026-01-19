import { NextResponse } from "next/server";
import { getPresentationRecordingByPresentationId } from "@/features/pptPresentations/services/presentationRecordingServices";
import { getPresentationSlidesById } from "@/features/pptPresentations/services/presentationServices";
import { getRecordingPresentationByRecordingId } from "@/features/simpleRecordings/services/recordingPresentationsServices";

export async function GET(
   _request: Request,
   { params }: { params: Promise<{ recordingId: string }> },
) {
   const { recordingId } = await params;

   if (!recordingId) {
      return NextResponse.json(
         {
            error: "Missing recordingId",
         },
         {
            status: 400,
         },
      );
   }

   const presentation =
      await getRecordingPresentationByRecordingId(recordingId);

   if (!presentation) {
      return NextResponse.json({
         presentationRecording: null,
         presentationSlides: [],
      });
   }

   const [presentationRecording, presentationSlides] = await Promise.all([
      getPresentationRecordingByPresentationId(presentation.id),
      getPresentationSlidesById(presentation.id),
   ]);

   return NextResponse.json({
      presentationRecording,
      presentationSlides,
      presentation,
   });
}
