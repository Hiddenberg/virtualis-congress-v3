import { NextResponse } from "next/server";
import { getAllOrganizationUsersRegisteredToCongress } from "@/features/congresses/services/congressRegistrationServices";
import { sendRecordingsAvailableEmail } from "@/features/emails/services/emailSendingServices";

let sent = false;
export async function GET() {
   if (sent === true) {
      return NextResponse.json({
         message: "Recordings already sent",
      });
   }

   const allUsersRegistered =
      await getAllOrganizationUsersRegisteredToCongress();

   const sentEmails = [];
   const failedEmails = [];
   for (const user of allUsersRegistered) {
      if (user.role === "attendant") {
         try {
            await sendRecordingsAvailableEmail(user.id);
            sentEmails.push(user.id);
         } catch (error) {
            console.error(
               `Error sending recordings available email to ${user.id}:`,
               error,
            );
            failedEmails.push(user.id);
         }
      }
   }

   sent = true;
   return NextResponse.json({
      message: "Recordings available",
      sentEmails,
      failedEmails,
   });
}
