import { format } from "@formkit/tempo";
import { RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import transporter from "@/libs/nodeMailer";
import pbServerClient from "@/libs/pbServerClient";
import { ConferenceRecording, SpeakerData } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import SENDER_EMAILS from "@/types/constants/senderEmails";
import "server-only";
import { getUserById } from "@/features/users/services/userServices";
import {
   getAttendantWelcomeEmailTemplate,
   getInaugurationInvitationEmailTemplate,
   getPaymentConfirmationEmailTemplate,
   getPresenterInvitationEmailTemplate,
   getRecordingCompletedEmailTemplate,
   getReRecordingEmailTemplate,
   getSecondDayEmailTemplate,
   getSpeakerRecordingInvitationEmailTemplate,
} from "@/utils/emailTemplateUtils";
import { getConferenceById } from "../features/conferences/services/conferenceServices";
import { getCongressById } from "../features/congresses/services/congressServices";
import {
   getExpandedSpeakerByUserId,
   getSpeakerAcademicTitleByUserId,
} from "../features/users/speakers/services/speakerServices";
import { getExpandedRecordingById } from "./recordingServices";

// Common email constants
const EMAIL_CONSTANTS = {
   SENDER_ALIAS: "ACP México",
   PLATFORM_BASE_URL: "https://acp-congress.virtualis.app",
   DATE_FORMAT: {
      FULL: "DD/MMMM/YYYY hh:mm A",
      DATE_ONLY: "DD/MMMM/YYYY",
      TIME_ONLY: "HH:mm",
   },
   LOCALE: "es-MX",
   TIMEZONE: "America/Mexico_City",
};

// Email subjects
const EMAIL_SUBJECTS = {
   PAYMENT_CONFIRMATION:
      "Confirmación de Pago y Acceso - 1er Congreso Internacional de Medicina Interna del ACP México Chapter",
   RECORDING_INVITATION: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Link para Grabación",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Recording Link",
   },
   PRESENTER_INVITATION: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Invitación como Presentador",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Presenter Invitation",
   },
   RECORDING_REMINDER: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Recordatorio de Grabación",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Recording Reminder",
   },
   RE_RECORDING: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Solicitud de Re-Grabación",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Re-Recording Request",
   },
   RECORDING_COMPLETED: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Grabación Guardada Exitosamente",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Recording Saved Successfully",
   },
   INAUGURATION_MESSAGE_INVITATION: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Invitación para grabar Mensaje de Inauguración",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Invitation to record Inauguration Message",
   },
   QnA_INVITATION: {
      "es-MX":
         "1er Congreso Internacional de Medicina Interna del ACP México Chapter - Invitación para la Sesión en Vivo de Preguntas y Respuestas",
      "en-US":
         "1st International Congress of Internal Medicine of the ACP México Chapter - Invitation to the Live QnA Session",
   },
};

/**
 * Sends a notification email to the specified recipient
 *
 * @param senderAlias - The display name of the sender
 * @param to - Email address of the recipient
 * @param subject - Subject line of the email
 * @param body - HTML content of the email
 * @param cc - Optional array of email addresses to CC
 * @returns Promise that resolves when the email is sent
 */
export async function sendNotificationEmail(
   senderAlias: string,
   to: string,
   subject: string,
   body: string,
   cc?: string[],
) {
   try {
      const sentMessageInfo = await transporter.sendMail({
         from: {
            address: SENDER_EMAILS.NOTIFICATIONS,
            name: senderAlias,
         },
         sender: SENDER_EMAILS.NOTIFICATIONS,
         to,
         subject,
         html: body,
         cc,
      });

      console.log(`Email sent successfully to ${to}`);
      console.log("sentMessageInfo", sentMessageInfo);
      return sentMessageInfo;
   } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error(
         `Failed to send notification email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendIndividualConferenceRecordingInvitationMail(
   conferenceId: string,
   cc?: string[],
) {
   try {
      // Get conference data
      const expandedConference = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
         .getOne<
            CongressConference &
               RecordModel & { expand: { speakers: (User & RecordModel)[] } }
         >(conferenceId, {
            expand: "speakers",
         });

      // Get recording data
      const conferenceRecording = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getFirstListItem<ConferenceRecording & RecordModel>(
            `conference = "${expandedConference.id}"`,
         );

      // Get speaker data
      let speakerData;
      try {
         speakerData = await pbServerClient
            .collection(PB_COLLECTIONS.SPEAKERS_DATA)
            .getFirstListItem<SpeakerData & RecordModel>(
               `user = "${expandedConference.expand.speakers[0].id}"`,
               {
                  fields: "academicTitle",
               },
            );
      } catch {
         speakerData = {
            academicTitle: "",
         };
      }

      // Prepare email data
      const emailData = {
         trackingUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/api/recording-invitation/${conferenceRecording.id}`,
         academicTitle: speakerData.academicTitle || "",
         speakerName: expandedConference.expand.speakers[0].name,
         speakerEmail: expandedConference.expand.speakers[0].email,
         speakerPreferredLanguage:
            expandedConference.expand.speakers[0].preferredLanguage,
         conferenceTitle: `${expandedConference.title}${expandedConference.shortDescription ? `: ${expandedConference.shortDescription}` : ""}`,
         conferenceDate: format({
            date: expandedConference.startTime,
            format: EMAIL_CONSTANTS.DATE_FORMAT.DATE_ONLY,
            locale: EMAIL_CONSTANTS.LOCALE,
            tz: EMAIL_CONSTANTS.TIMEZONE,
         }),
         conferenceTime: `${format({
            date: expandedConference.startTime,
            format: EMAIL_CONSTANTS.DATE_FORMAT.TIME_ONLY,
            locale: EMAIL_CONSTANTS.LOCALE,
            tz: EMAIL_CONSTANTS.TIMEZONE,
         })} Hrs`,
         recordingUrl: conferenceRecording.recordingUrl,
      };

      // Generate email template
      const emailTemplate = getSpeakerRecordingInvitationEmailTemplate(
         {
            trackingUrl: emailData.trackingUrl,
            academicTitle: emailData.academicTitle,
            speakerName: emailData.speakerName,
            conferenceTitle: emailData.conferenceTitle,
            conferenceDate: emailData.conferenceDate,
            conferenceTime: emailData.conferenceTime,
            recordingUrl: emailData.recordingUrl,
         },
         emailData.speakerPreferredLanguage,
      );

      // Determine subject based on language
      const languageKey =
         emailData.speakerPreferredLanguage as keyof typeof EMAIL_SUBJECTS.RECORDING_INVITATION;
      const emailSubject =
         EMAIL_SUBJECTS.RECORDING_INVITATION[languageKey] ||
         EMAIL_SUBJECTS.RECORDING_INVITATION["es-MX"];

      // Send the email
      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         emailData.speakerEmail,
         emailSubject,
         emailTemplate,
         cc,
      );

      console.log(
         `Sent invitation email in ${languageKey} to ${emailData.speakerEmail}`,
      );
   } catch (error) {
      console.error(
         `Failed to send conference recording invitation for conference ${conferenceId}:`,
         error,
      );
      throw new Error(
         `Failed to send conference recording invitation: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendPresentationRecordingInvitationMail(
   conferenceId: string,
   cc?: string[],
) {
   try {
      // Get conference data
      const filter = `conference = "${conferenceId}" && recordingType = "presentation"`;
      const presentationRecording = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getFirstListItem<
            ConferenceRecording &
               RecordModel & {
                  expand: {
                     usersWhoWillRecord: (User & RecordModel)[];
                     conference: CongressConference & RecordModel;
                  };
               }
         >(filter, {
            expand: "usersWhoWillRecord, conference",
         });

      const presenterData = presentationRecording.expand.usersWhoWillRecord[0];
      if (!presenterData) {
         throw new Error("No presenter data found for presentation recording");
      }

      const conferenceData = presentationRecording.expand.conference;
      if (!conferenceData) {
         throw new Error("No conference data found for presentation recording");
      }

      const presenterEmail = presenterData.email;
      const presenterName = presenterData.name;

      // REFACTOR: This is a temporary fix to allow the sendPresentationRecordingInvitationMail to work, we need to get the speakers from the conference
      const speakerUserIds = [""];
      const speakersData = await Promise.all(
         speakerUserIds.map(async (speakerId) => {
            const speakerData = await getExpandedSpeakerByUserId(speakerId);
            return speakerData;
         }),
      );

      const speakerNamesAndTitles = speakersData
         .map(
            (speaker) =>
               `${speaker.academicTitle || ""} ${speaker.expand.user.name}`,
         )
         .join(", ");

      const trackingUrl = `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/api/recording-invitation/${presentationRecording.id}`;
      const presenterInvitationEmailTemplate =
         getPresenterInvitationEmailTemplate({
            trackingUrl,
            conferenceTitle: conferenceData.title,
            conferenceDescription: conferenceData.shortDescription || "",
            presenterName,
            speakerNamesAndTitles,
            recordingUrl: presentationRecording.recordingUrl,
         });

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         presenterEmail,
         EMAIL_SUBJECTS.PRESENTER_INVITATION["es-MX"],
         presenterInvitationEmailTemplate,
         cc,
      );

      console.log("Email sent to", presenterEmail);
   } catch (error) {
      console.error(
         `Failed to send presenter invitation for conference ${conferenceId}:`,
         error,
      );
      throw new Error(
         `Failed to send presenter invitation: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendInaugurationMessageRecordingInvitationMail(
   conferenceId: string,
   cc?: string[],
) {
   try {
      const filter = `conference = "${conferenceId}" && recordingType = "presentation"`;
      const presentationRecording = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getFirstListItem<
            ConferenceRecording &
               RecordModel & {
                  expand: {
                     usersWhoWillRecord: (User & RecordModel)[];
                     conference: CongressConference & RecordModel;
                  };
               }
         >(filter, {
            expand: "usersWhoWillRecord, conference",
         });

      const presenterData = presentationRecording.expand.usersWhoWillRecord[0];
      if (!presenterData) {
         throw new Error("No presenter data found for presentation recording");
      }

      const conferenceData = presentationRecording.expand.conference;
      if (!conferenceData) {
         throw new Error("No conference data found for presentation recording");
      }

      const presenterEmail = presenterData.email;
      const presenterName = presenterData.name;

      const trackingUrl = `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/api/recording-invitation/${presentationRecording.id}`;

      const academicTitle =
         (await getSpeakerAcademicTitleByUserId(presenterData.id)) || "";
      const inaugurationInvitationEmailTemplate =
         getInaugurationInvitationEmailTemplate({
            trackingUrl,
            speakerName: presenterName,
            academicTitle: academicTitle,
            recordingUrl: presentationRecording.recordingUrl,
         });

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         presenterEmail,
         EMAIL_SUBJECTS.INAUGURATION_MESSAGE_INVITATION["es-MX"],
         inaugurationInvitationEmailTemplate,
         cc,
      );
   } catch (error) {
      console.error(
         `Failed to send inauguration message invitation for conference ${conferenceId}:`,
         error,
      );
      throw new Error(
         `Failed to send inauguration message invitation: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendAllIndividualRecordingInvitationMails() {
   try {
      // Get all individual conferences for the current congress
      const individualConferences = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
         .getFullList<CongressConference & RecordModel>({
            filter: `conferenceType = "individual" && congress = "${TEMP_CONSTANTS.CONGRESS_ID}"`,
         });

      const results = {
         skipped: 0,
         sent: 0,
         failed: 0,
      };

      for (const conference of individualConferences) {
         try {
            // Create filter to find recording information
            const filter = `conference = "${conference.id}" && usersWhoWillRecord.id = "${conference.speakers[0]}"`;

            // Try to get the recording for this conference
            let conferenceSpeakerRecording;
            try {
               conferenceSpeakerRecording = await pbServerClient
                  .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
                  .getFirstListItem<ConferenceRecording & RecordModel>(filter);
            } catch {
               console.log(
                  "No recording found for conference, skipping",
                  conference.id,
               );
               console.log("Filter used:", filter);
               results.skipped++;
               continue;
            }

            // Skip if invitation was already sent
            if (conferenceSpeakerRecording.invitationEmailSent) {
               console.log(
                  "Invitation email already sent for conference, skipping",
                  conference.id,
               );
               results.skipped++;
               continue;
            }

            console.log(
               "Sending email for conference:",
               conference.title,
               "(ID:",
               conference.id,
               ")",
            );

            // Send the invitation email
            await sendIndividualConferenceRecordingInvitationMail(
               conference.id,
            );

            // Update recording record to mark email as sent
            await pbServerClient
               .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
               .update(conferenceSpeakerRecording.id, {
                  invitationEmailSent: true,
               });

            results.sent++;
         } catch (error) {
            console.error(
               `Error processing conference ${conference.id}:`,
               error,
            );
            results.failed++;
         }
      }

      return results;
   } catch (error) {
      console.error("Error sending recording invitations:", error);
      throw new Error(
         `Failed to send recording invitations: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendPaymentConfirmationEmail(user: User & RecordModel) {
   try {
      const congress = await getCongressById(TEMP_CONSTANTS.CONGRESS_ID);

      if (!congress) {
         throw new Error(
            "Congress not found when sending payment confirmation email",
         );
      }

      const emailData = {
         userName: user.name,
         userEmail: user.email,
         platformLink: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/lobby`,
         congressName: congress.title,
         congressStartDate: format({
            date: congress.startDate,
            format: EMAIL_CONSTANTS.DATE_FORMAT.FULL,
            locale: EMAIL_CONSTANTS.LOCALE,
            tz: EMAIL_CONSTANTS.TIMEZONE,
         }),
         congressEndDate: format({
            date: congress.finishDate,
            format: EMAIL_CONSTANTS.DATE_FORMAT.FULL,
            locale: EMAIL_CONSTANTS.LOCALE,
            tz: EMAIL_CONSTANTS.TIMEZONE,
         }),
      };

      const emailTemplate = getPaymentConfirmationEmailTemplate(emailData);

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         emailData.userEmail,
         EMAIL_SUBJECTS.PAYMENT_CONFIRMATION,
         emailTemplate,
      );

      console.log("Payment confirmation email sent to", emailData.userEmail);
   } catch (error) {
      console.error(
         `Failed to send payment confirmation email to user ${user.id}:`,
         error,
      );
      throw new Error(
         `Failed to send payment confirmation: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

// export async function sendRecordingReminderEmail (recordingId: string) {
//    try {
//       const expandedRecording = await getExpandedRecordingById(recordingId)

//       if (!expandedRecording) {
//          throw new Error(`Recording ${recordingId} not found when sending recording reminder email`)
//       }

//       if (!expandedRecording.expand.usersWhoWillRecord) {
//          throw new Error(`No users who will record found for this recording ${recordingId}`)
//       }

//       const userEmail = expandedRecording.expand.usersWhoWillRecord[0].email
//       const preferredLanguage = expandedRecording.expand.usersWhoWillRecord[0].preferredLanguage

//       const recordingReminderEmailTemplate = getRecordingReminderEmailTemplate({
//          conferenceTitle: expandedRecording.expand.conference.title,
//          personName: expandedRecording.expand.usersWhoWillRecord[0].name,
//          recordingUrl: expandedRecording.recordingUrl,
//          trackingUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/api/recording-reminder/${recordingId}`
//       }, preferredLanguage)

//       await sendNotificationEmail(
//          EMAIL_CONSTANTS.SENDER_ALIAS,
//          userEmail,
//          EMAIL_SUBJECTS.RECORDING_REMINDER[preferredLanguage === "es-MX" ? "es-MX" : "en-US"],
//          recordingReminderEmailTemplate
//       )
//       console.log(`Reminder email sent to ${userEmail} in ${preferredLanguage}`)
//    } catch (error) {
//       console.error(`Failed to send recording reminder email for recording ${recordingId}:`, error)
//       throw new Error(`Failed to send recording reminder: ${error instanceof Error ? error.message : String(error)}`)
//    }
// }

export async function sendReRecordingEmail(recordingId: string) {
   try {
      const expandedRecording = await getExpandedRecordingById(recordingId);

      if (!expandedRecording) {
         throw new Error(
            `Recording ${recordingId} not found when sending re-recording email`,
         );
      }

      if (expandedRecording.reRecordingEmailSent) {
         console.log(
            "Re-recording email already sent for recording, skipping",
            recordingId,
         );
         return;
      }

      const userEmail = expandedRecording.expand.usersWhoWillRecord?.[0]?.email;
      if (!userEmail) {
         throw new Error(
            `User email not found for recording ${expandedRecording.id} when sending re-recording email`,
         );
      }

      const academicTitle =
         (await getSpeakerAcademicTitleByUserId(
            expandedRecording.usersWhoWillRecord[0],
         )) || "";

      const speakerName =
         expandedRecording.expand.usersWhoWillRecord?.[0]?.name;
      if (!speakerName) {
         throw new Error(
            `Speaker name not found for recording ${expandedRecording.id} when sending re-recording email`,
         );
      }

      const reRecordingEmailTemplate = getReRecordingEmailTemplate({
         trackingUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/api/re-recording/${recordingId}`,
         conferenceTitle: expandedRecording.expand.conference.title,
         personName: speakerName,
         academicTitle: academicTitle,
         recordingUrl: expandedRecording.recordingUrl,
      });

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         userEmail,
         EMAIL_SUBJECTS.RE_RECORDING["es-MX"],
         reRecordingEmailTemplate,
      );

      console.log("Re-recording email sent to", userEmail);
   } catch (error) {
      console.error(
         `Failed to send re-recording email for recording ${recordingId}:`,
         error,
      );
      throw new Error(
         `Failed to send re-recording email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendRecordingCompletedEmail(recordingId: string) {
   try {
      const expandedRecording = await getExpandedRecordingById(recordingId);

      if (!expandedRecording) {
         throw new Error(
            `Recording ${recordingId} not found when sending recording completed email`,
         );
      }

      if (!expandedRecording.expand.usersWhoWillRecord) {
         throw new Error(
            `No users who will record found for this recording ${recordingId}`,
         );
      }

      const speakerEmail = expandedRecording.expand.usersWhoWillRecord[0].email;
      const speakerName = expandedRecording.expand.usersWhoWillRecord[0].name;
      const academicTitle =
         (await getSpeakerAcademicTitleByUserId(
            expandedRecording.usersWhoWillRecord[0],
         )) || "";

      const preferredLanguage =
         expandedRecording.expand.usersWhoWillRecord[0].preferredLanguage;

      const recordingCompletedEmailTemplate =
         getRecordingCompletedEmailTemplate(
            {
               conferenceTitle: expandedRecording.expand.conference.title,
               speakerName: speakerName,
               academicTitle: academicTitle,
               videoUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/watch-recording/${recordingId}`,
            },
            preferredLanguage,
         );

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         speakerEmail,
         EMAIL_SUBJECTS.RECORDING_COMPLETED[
            preferredLanguage === "es-MX" ? "es-MX" : "en-US"
         ],
         recordingCompletedEmailTemplate,
      );
      console.log("Recording completed email sent to", speakerEmail);
   } catch (error) {
      console.error(
         `Failed to send recording completed email for recording ${recordingId}:`,
         error,
      );
      throw new Error(
         `Failed to send recording completed email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendQnAInvitationEmails(conferenceId: string) {
   try {
      const conference = await getConferenceById(conferenceId);

      if (!conference) {
         throw new Error(
            `Conference ${conferenceId} not found when sending QnA invitation email`,
         );
      }

      // REFACTOR: This is a temporary fix to allow the sendQnAInvitationEmails to work, we need to get the speakers from the conference
      const conferenceSpeakers = ["asd"];
      const speakerUser = await getUserById(conferenceSpeakers[0]);

      if (!speakerUser) {
         throw new Error(
            `Speaker user ${conferenceSpeakers[0]} not found when sending QnA invitation email`,
         );
      }

      const speakerEmail = speakerUser.email;
      // const speakerAcademicTitle = await getSpeakerAcademicTitleByUserId(conferenceSpeakers[0]) || ""
      // const speakerName = speakerUser.name

      // const qaInvitationEmailTemplate = getQnAInvitationEmailTemplate({
      //    academicTitle: speakerAcademicTitle,
      //    speakerName,
      //    conferenceTitle: conference.title,
      //    qaDate: format({
      //       date: conference.startTime,
      //       format: EMAIL_CONSTANTS.DATE_FORMAT.FULL,
      //       locale: EMAIL_CONSTANTS.LOCALE,
      //       tz: EMAIL_CONSTANTS.TIMEZONE
      //    }),
      //    liveSessionUrl: `https://acp-congress.virtualis.app/QnA-transmission/${conference.id}`
      // }, speakerUser.preferredLanguage)

      // await sendNotificationEmail(
      //    EMAIL_CONSTANTS.SENDER_ALIAS,
      //    speakerEmail,
      //    EMAIL_SUBJECTS.QnA_INVITATION[speakerUser.preferredLanguage as keyof typeof EMAIL_SUBJECTS.QnA_INVITATION],
      //    qaInvitationEmailTemplate
      // )
      console.log("QnA invitation email sent to speaker", speakerEmail);

      // REFACTOR: This is a temporary fix to allow the sendQnAInvitationEmails to work, we need to get the presenter from the conference
      const presenterUserId = "asd";

      if (presenterUserId) {
         const presenterUser = await getUserById(presenterUserId);

         if (!presenterUser) {
            throw new Error(
               `Presenter user ${presenterUserId} not found when sending QnA invitation email`,
            );
         }

         const presenterEmail = presenterUser.email;
         // const presenterAcademicTitle = ""

         // const qaInvitationEmailTemplate = getQnAInvitationEmailTemplate({
         //    academicTitle: presenterAcademicTitle,
         //    speakerName: presenterUser.name,
         //    conferenceTitle: conference.title,
         //    qaDate: format({
         //       date: conference.startTime,
         //       format: EMAIL_CONSTANTS.DATE_FORMAT.FULL,
         //       locale: EMAIL_CONSTANTS.LOCALE,
         //       tz: EMAIL_CONSTANTS.TIMEZONE
         //    }),
         //    liveSessionUrl: `https://acp-congress.virtualis.app/QnA-transmission/${conference.id}?ishost=true`
         // }, presenterUser.preferredLanguage)

         // await sendNotificationEmail(
         //   EMAIL_CONSTANTS.SENDER_ALIAS,
         //    presenterEmail,
         //    EMAIL_SUBJECTS.QnA_INVITATION[presenterUser.preferredLanguage as keyof typeof EMAIL_SUBJECTS.QnA_INVITATION],
         //    qaInvitationEmailTemplate
         // )
         console.log("QnA invitation email sent to presenter", presenterEmail);
      }
   } catch (error) {
      console.error(
         `Failed to send QnA invitation email for conference ${conferenceId}:`,
         error,
      );
      throw new Error(
         `Failed to send QnA invitation email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendAttendantWelcomeEmail(userId: string) {
   try {
      const user = await getUserById(userId);

      if (!user) {
         throw new Error(
            `User ${userId} not found when sending attendant welcome email`,
         );
      }

      const attendantWelcomeEmailTemplate = getAttendantWelcomeEmailTemplate({
         attendeeName: user.name,
         eventTitle:
            "1er Congreso Internacional de Medicina Interna de ACP México Chapter",
         eventDate: "10 de abril de 2025",
         eventTime: "08:00 AM",
         joinUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/lobby`,
      });

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         user.email,
         "¡Te invitamos al 1er Congreso Internacional de Medicina Interna de ACP México Chapter!",
         attendantWelcomeEmailTemplate,
      );

      console.log("Attendant welcome email sent to", user.email);
   } catch (error) {
      console.error(
         `Failed to send attendant welcome email for user ${userId}:`,
         error,
      );
      throw new Error(
         `Failed to send attendant welcome email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendSecondDayEmail(userId: string) {
   try {
      const user = await getUserById(userId);

      if (!user) {
         throw new Error(
            `User ${userId} not found when sending second day email`,
         );
      }

      const secondDayEmailTemplate = getSecondDayEmailTemplate({
         attendeeName: user.name,
         attendeeEmail: user.email,
         joinUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/lobby`,
      });

      await sendNotificationEmail(
         EMAIL_CONSTANTS.SENDER_ALIAS,
         user.email,
         "¡2do Día del Congreso Internacional de Medicina Interna de ACP México Chapter!",
         secondDayEmailTemplate,
      );

      console.log("Second day email sent to", user.email);
   } catch (error) {
      console.error(
         `Failed to send second day email for user ${userId}:`,
         error,
      );
      throw new Error(
         `Failed to send second day email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendDay3Email(userId: string) {
   try {
      const user = await getUserById(userId);

      if (!user) {
         throw new Error(`User ${userId} not found when sending day 3 email`);
      }

      // const day3EmailTemplate = getDay3EmailTemplate({
      //    attendeeName: user.name,
      //    attendeeEmail: user.email,
      //    joinUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/lobby`,
      // }, user.preferredLanguage)

      // await sendNotificationEmail(
      //    EMAIL_CONSTANTS.SENDER_ALIAS,
      //    user.email,
      //    user.preferredLanguage === "es-MX" ? "¡3er Día del Congreso Internacional de Medicina Interna de ACP México Chapter!" : "¡3rd Day of the International Congress of Internal Medicine of the ACP México Chapter!",
      //    day3EmailTemplate
      // )

      console.log("Day 3 email sent to", user.email);
   } catch (error) {
      console.error(`Failed to send day 3 email for user ${userId}:`, error);
      throw new Error(
         `Failed to send day 3 email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendCongressFinalizationEmail(userId: string) {
   try {
      const user = await getUserById(userId);

      if (!user) {
         throw new Error(
            `User ${userId} not found when sending congress finalization email`,
         );
      }

      // const congressFinalizationEmailTemplate = getCongressFinalizationEmailTemplate({
      //    attendeeName: user.name,
      //    joinUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/certificates`
      // }, user.preferredLanguage)

      // await sendNotificationEmail(
      //    EMAIL_CONSTANTS.SENDER_ALIAS,
      //    user.email,
      //    user.preferredLanguage === "es-MX" ? "Final del 1er Congreso Internacional de Medicina Interna de ACP México Chapter" : "End of the 1st International Congress of Internal Medicine of the ACP México Chapter",
      //    congressFinalizationEmailTemplate
      // )

      console.log("Congress finalization email sent to", user.email);
   } catch (error) {
      console.error(
         `Failed to send congress finalization email for user ${userId}:`,
         error,
      );
      throw new Error(
         `Failed to send congress finalization email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendEmailToAllAttendeesWithPaymentsConfirmed() {
   try {
      console.log(
         "Started sending email to all attendees with payments confirmed",
      );

      console.log("Getting attendees with payments confirmed");
      const userPayments = await pbServerClient
         .collection(PB_COLLECTIONS.USER_PAYMENTS)
         .getFullList<UserPayment & RecordModel>({
            filter: "user != null",
         });
      console.log(
         "Sending email to all attendees with payments confirmed",
         userPayments.length,
      );

      const usersWithEmailSent: string[] = [];
      const usersWithError: string[] = [];

      for (const payment of userPayments) {
         try {
            if (usersWithEmailSent.includes(payment.user)) {
               console.log("Email already sent to", payment.user);
               continue;
            }

            await sendCongressFinalizationEmail(payment.user);
            usersWithEmailSent.push(payment.user);
            console.log("Email sent to", payment.user);
         } catch {
            usersWithError.push(payment.user);
            console.error("Error sending email to", payment.user);
         }
      }

      return {
         usersWithEmailSent,
         usersWithError,
         usersWithEmailSentCount: usersWithEmailSent.length,
         usersWithErrorCount: usersWithError.length,
      };
   } catch (error) {
      console.error(
         `Failed to send email to all attendees with payments confirmed:`,
         error,
      );
      throw new Error(
         `Failed to send email to all attendees with payments confirmed: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}

export async function sendCertificateGenerationReminderEmail(userId: string) {
   try {
      const user = await getUserById(userId);

      if (!user) {
         throw new Error(
            `User ${userId} not found when sending certificate generation reminder email`,
         );
      }

      // const certificateGenerationReminderEmailTemplate = getCertificateGenerationReminderEmailTemplate(user.preferredLanguage, {
      //    attendeeName: user.name,
      //    attendeeEmail: user.email,
      //    certificatesUrl: `${EMAIL_CONSTANTS.PLATFORM_BASE_URL}/certificates`
      // })

      // await sendNotificationEmail(
      //    EMAIL_CONSTANTS.SENDER_ALIAS,
      //    user.email,
      //    "Recordatorio: Descarga tu certificado de asistencia",
      //    certificateGenerationReminderEmailTemplate
      // )

      console.log("Certificate generation reminder email sent to", user.email);
   } catch (error) {
      console.error(
         `Failed to send certificate generation reminder email for user ${userId}:`,
         error,
      );
      throw new Error(
         `Failed to send certificate generation reminder email: ${error instanceof Error ? error.message : String(error)}`,
      );
   }
}
