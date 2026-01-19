import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { updateRecordingDurationFromMuxData } from "@/services/recordingServices";
import { getRecordingsWithVideoAssets } from "@/services/serverAggregators/recordingAggregators";

export async function GET(request: NextRequest) {
   if (request.nextUrl.searchParams.get("approved") !== "true") {
      notFound();
      return;
   }

   const recordingsWithVideoAssets = await getRecordingsWithVideoAssets();

   const recordingsWithError = [];
   const recordingsWithSuccess = [];

   for (const recordingWithVideoAssets of recordingsWithVideoAssets) {
      try {
         await updateRecordingDurationFromMuxData(recordingWithVideoAssets.id);
         recordingsWithSuccess.push(recordingWithVideoAssets.id);
         console.log(recordingWithVideoAssets.id);
      } catch (error) {
         console.error(
            `[Quick Test] Error updating recording duration for ${recordingWithVideoAssets.id}`,
            error,
         );
         recordingsWithError.push(recordingWithVideoAssets.id);
      }
   }

   return NextResponse.json({
      status: "success",
      successCount: recordingsWithSuccess.length,
      errorCount: recordingsWithError.length,
      recordingsWithSuccess,
      recordingsWithError,
   });
}
