import { getSimpleRecordingById, updateSimpleRecording } from "@/features/simpleRecordings/services/recordingsServices";

export async function GET(request: Request, { params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "base64",
   );

   try {
      const recording = await getSimpleRecordingById(recordingId);

      if (!recording) {
         console.log(`[RecordingInvitationTrackAPI] Simple recording ${recordingId} not found`);
      } else {
         await updateSimpleRecording(recordingId, {
            invitationEmailStatus: "opened",
            invitationEmailOpenedAt: new Date().toISOString(),
         });
         console.log(`[RecordingInvitationTrackAPI] Invitation email opened for simple recording ${recordingId}`);
      }
   } catch (error) {
      console.error("[RecordingInvitationTrackAPI] Error updating invitation open status", error);
   }

   return new Response(pixel, {
      headers: {
         "Content-Type": "image/png",
         "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
         Pragma: "no-cache",
         Expires: "0",
      },
   });
}
