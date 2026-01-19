import { RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import { getRecordingById } from "@/services/recordingServices";
import { ConferenceRecording } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export async function GET(
   request: Request,
   { params }: { params: Promise<{ recordingId: string }> },
) {
   const { recordingId } = await params;

   console.log(
      `[ReRecordingAPI] Re-recording tracking route hit for recording ${recordingId}`,
   );

   const recording = await getRecordingById(recordingId);

   if (!recording) {
      console.log(`[ReRecordingAPI] Recording ${recordingId} not found`);
   }

   const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64",
   );

   if (recording && !recording.reRecordingEmailOpenedAt) {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            reRecordingEmailSent: true,
            reRecordingEmailOpenedAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording & RecordModel>);
      console.log(
         `[ReRecordingAPI] Recording invitation email opened for recording ${recordingId}`,
      );
   }

   if (recording && recording.reRecordingEmailOpenedAt) {
      console.log(
         `[ReRecordingAPI] Recording invitation was already opened for recording ${recordingId}`,
      );
   }

   return new Response(pixel, {
      headers: {
         "Content-Type": "image/gif",
         "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
         Pragma: "no-cache",
         Expires: "0",
      },
   });
}
