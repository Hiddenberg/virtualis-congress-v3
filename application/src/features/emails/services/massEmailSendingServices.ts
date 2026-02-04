import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getCongressById } from "@/features/congresses/services/congressServices";
import "server-only";
import { getSpeakerSlidesFilesByConferenceId } from "@/features/speakerSlidesV2/services/speakerSlidesFilesServices";
import { sendSpeakerPresentationUploadReminderEmail } from "./emailSendingServices";

export async function sendSpeakerPresentationUploadReminderEmailToAllSpeakers(congressId: string) {
   const congress = await getCongressById(congressId);
   if (!congress) {
      throw new Error("[MassEmailSendingServices] Congress not found");
   }

   // Get all conferences of the congress
   const congressConferences = await getAllCongressConferences(congressId);

   // This applies only to in-person and livestream conferences
   const liveConferences = congressConferences.filter(
      ({ conferenceType }) => conferenceType === "in-person" || conferenceType === "livestream",
   );

   if (congressConferences.length === 0) {
      throw new Error("[MassEmailSendingServices] No conferences found for the congress");
   }

   const emailsSentArray: {
      conferenceId: string;
      conferenceTitle: string;
      speakerNames: string[];
   }[] = [];
   const skippedEmailsArray: {
      conferenceId: string;
      conferenceTitle: string;
      reason: string;
   }[] = [];
   const failedEmailsArray: {
      conferenceId: string;
      conferenceTitle: string;
      error: string;
   }[] = [];

   // Send the email to all speakers of the congress
   for (const liveConference of liveConferences) {
      try {
         // Check if the conference already has a presentation uploaded
         const conferenceSlidesFiles = await getSpeakerSlidesFilesByConferenceId(liveConference.id);

         if (conferenceSlidesFiles.length > 0) {
            skippedEmailsArray.push({
               conferenceId: liveConference.id,
               conferenceTitle: liveConference.title,
               reason: `Presentation already uploaded for the conference: ${liveConference.title} (${liveConference.id})`,
            });
            continue;
         }

         // Get all speakers of the conference
         const conferenceSpeakers = await getConferenceSpeakers(liveConference.id);

         if (conferenceSpeakers.length === 0) {
            skippedEmailsArray.push({
               conferenceId: liveConference.id,
               conferenceTitle: liveConference.title,
               reason: `No speakers found for the conference: ${liveConference.title} (${liveConference.id})`,
            });
            continue;
         }

         const speakerNames: string[] = [];

         // Send the email to all speakers of the conference
         for (const speaker of conferenceSpeakers) {
            if (!speaker.user) {
               skippedEmailsArray.push({
                  conferenceId: liveConference.id,
                  conferenceTitle: liveConference.title,
                  reason: `No user found for the speaker: ${speaker.displayName} (${speaker.id})`,
               });
               continue;
            }

            await sendSpeakerPresentationUploadReminderEmail({
               userId: speaker.user,
               conferenceId: liveConference.id,
            });
            speakerNames.push(speaker.displayName);
         }

         emailsSentArray.push({
            conferenceId: liveConference.id,
            conferenceTitle: liveConference.title,
            speakerNames,
         });
      } catch (error) {
         if (error instanceof Error) {
            failedEmailsArray.push({
               conferenceId: liveConference.id,
               conferenceTitle: liveConference.title,
               error: error.message,
            });
         } else {
            failedEmailsArray.push({
               conferenceId: liveConference.id,
               conferenceTitle: liveConference.title,
               error: "An unknown error occurred",
            });
         }
      }
   }

   return {
      successMessage: `Emails sent to ${emailsSentArray.length} speakers of ${liveConferences.length} conferences, ${skippedEmailsArray.length} skipped, ${failedEmailsArray.length} failed`,
      emailsSentArray,
      skippedEmailsArray,
      failedEmailsArray,
   };
}
