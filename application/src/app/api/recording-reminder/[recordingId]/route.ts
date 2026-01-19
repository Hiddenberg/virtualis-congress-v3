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
      `[RecordingReminderAPI] Email reminder tracking route hit for recording ${recordingId}`,
   );

   const recording = await getRecordingById(recordingId);

   if (!recording) {
      console.log(`[RecordingReminderAPI] Recording ${recordingId} not found`);
   }

   const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64",
   );

   if (recording) {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            lastReminderOpenedAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording & RecordModel>);
      console.log(
         `[RecordingReminderAPI] Recording reminder email opened for recording ${recordingId}`,
      );
   }

   if (recording && recording.lastReminderOpenedAt) {
      console.log(
         `[RecordingReminderAPI] Recording reminder was already opened for recording ${recordingId}`,
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
