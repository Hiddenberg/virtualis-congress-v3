import { type NextRequest, NextResponse } from "next/server";
import { sendRecordingReminderEmail } from "@/features/emails/services/emailSendingServices";
import {
   getAllCampaignRecordings,
   getRecordingsCampaignById,
} from "@/features/simpleRecordings/services/recordingCampaignsServices";

let sent = false;
export async function GET(request: NextRequest) {
   if (sent === true) {
      return NextResponse.json({
         message: "Recordings reminder already sent",
      });
   }

   const recordingCampaignId =
      request.nextUrl.searchParams.get("recordingCampaign");

   if (!recordingCampaignId) {
      return NextResponse.json({
         message: "Recording campaign ID is required",
      });
   }

   const recordingCampaign =
      await getRecordingsCampaignById(recordingCampaignId);

   if (!recordingCampaign) {
      return NextResponse.json({
         message: "Recording campaign not found",
      });
   }

   const recordings = await getAllCampaignRecordings(recordingCampaignId);

   const sentEmails: {
      recordingId: string;
      email: string;
   }[] = [];
   const failedEmails: {
      recordingId: string;
      email: string;
      error: string;
   }[] = [];

   for (const recording of recordings) {
      try {
         await sendRecordingReminderEmail(recording.id);
         sentEmails.push({
            recordingId: recording.id,
            email: recording.recorderEmail,
         });
      } catch (error) {
         failedEmails.push({
            recordingId: recording.id,
            email: recording.recorderEmail,
            error: error instanceof Error ? error.message : String(error),
         });
      }
   }

   sent = true;
   return NextResponse.json({
      message: "Recordings reminder sent",
      sentEmails,
      failedEmails,
   });
}
