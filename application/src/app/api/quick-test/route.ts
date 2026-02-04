import { NextResponse } from "next/server";
import { sendSpeakerPresentationUploadReminderEmail } from "@/features/emails/services/emailSendingServices";

export async function GET() {
   await sendSpeakerPresentationUploadReminderEmail({
      conferenceId: "g0ld47offitmm09",
      userId: "y4o0tufpt2wr4q8",
   });
   return NextResponse.json({
      message: "Hello World",
   });
}
