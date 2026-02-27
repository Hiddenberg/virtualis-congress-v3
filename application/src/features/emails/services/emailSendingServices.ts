import { addDay, format } from "@formkit/tempo";
import { render } from "@react-email/components";
import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { getAllCongressConferences, getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakerPresentationRecordingRecordByRecordingId } from "@/features/conferences/services/conferenceSpeakerPresentationRecordingServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import { getCongressById, getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   checkIfUserHasAccessToRecordings,
   getUserPurchasedModality,
} from "@/features/organizationPayments/services/userPurchaseServices";
import { getOrganizationBaseUrl, getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getSimpleRecordingById, updateSimpleRecording } from "@/features/simpleRecordings/services/recordingsServices";
import { createRecordingTrackedEmailRecord } from "@/features/simpleRecordings/services/recordingTrackedEmailsServices";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import { getRecordingLink } from "@/features/simpleRecordings/utils/recordingUtils";
import { createTrackedEmailRecord, updateTrackedEmailRecord } from "@/features/trackedEmails/services/trackedEmailServices";
import { getUserByEmail, getUserById } from "@/features/users/services/userServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import transporter from "@/libs/nodeMailer";
import SENDER_EMAILS from "../constants/emailConstants";
import AboutToStartEventTemplate from "../templates/AboutToStartEventTemplate";
import ACPWIMRecordingInvitationTemplate from "../templates/ACPWIMRecordingInvitationTemplate";
import AccountCreatedTemplate from "../templates/AccountCreatedTemplate";
import CoordinatorCVRecordingInvitationTemplate from "../templates/CoordinatorCVRecordingInvitation";
import CourtesyInvitationEmailTemplate from "../templates/CourtesyInvitationEmailTemplate";
import EventFinishedTemplate from "../templates/EventFinishedTemplate";
import IphoneIssueSolvedTemplate from "../templates/IphoneIssueSolvedTemplate";
import NewEventDayAboutToStartEmailTemplate from "../templates/NewEventDayAboutToStart";
import NonPayersCongressInvitationTemplate from "../templates/NonPayersCongressInvitation";
import OnDemandReminderTemplate from "../templates/OnDemandReminderTemplate";
import OTPCodeTemplate from "../templates/OTPCodeTemplate";
import PaymentConfirmationTemplate from "../templates/PaymentConfirmationTemplate";
import PreCongressInvitationTemplate from "../templates/PreCongressInvitationTemplate";
import RecordingInvitationTemplate from "../templates/RecordingInvitationTemplate";
import RecordingReminder from "../templates/RecordingReminder";
import RecordingsReadyTemplate from "../templates/RecordingsReadyTemplate";
import SpeakerCertificateTemplate from "../templates/SpeakerCertificateTemplate";
import SpeakerPresentationUploadReminderTemplate from "../templates/SpeakerPresentationUploadReminderTemplate";
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
export async function sendNotificationEmail(senderAlias: string, to: string, subject: string, body: string, cc?: string[]) {
   try {
      const sentMessageInfo = await transporter.sendMail({
         from: {
            address: SENDER_EMAILS.CONGRESS,
            name: senderAlias,
         },
         sender: SENDER_EMAILS.CONGRESS,
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
      throw new Error(`Failed to send notification email: ${error instanceof Error ? error.message : String(error)}`);
   }
}

async function sendEmailToAllEmailsOfTheUser({
   user,
   senderAlias,
   to,
   subject,
   template,
}: {
   user: UserRecord;
   senderAlias: string;
   to: string;
   subject: string;
   template: string;
}) {
   const additionalEmails = [];

   if (user.additionalEmail1) {
      additionalEmails.push(user.additionalEmail1);
   }
   if (user.additionalEmail2) {
      additionalEmails.push(user.additionalEmail2);
   }

   await sendNotificationEmail(senderAlias, to, subject, template, additionalEmails);
}

export async function sendRecordingsAvailableEmail(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

   const template = await render(
      RecordingsReadyTemplate({
         userName: user.name,
         congressTitle: congress.title,
         accessLink: `${protocol}://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/lobby`,
         organizationName: organization.name,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: "Grabaciones disponibles!",
      template,
   });
}

export async function sendPlatformRegistrationConfirmationEmail(userId: string) {
   const user = await getUserById(userId);

   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const organizationCongress = await getLatestCongress();
   if (!organizationCongress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const congressStartDate = format({
      date: organizationCongress.startDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });
   const congressEndDate = format({
      date: organizationCongress.finishDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const template = await render(
      AccountCreatedTemplate({
         userName: user.name.split(" ")[0],
         platformLink: `${organizationBaseUrl}/lobby`,
         congressDates: `Del ${congressStartDate} al ${congressEndDate}`,
         congressTitle: organizationCongress.title,
         organizationName: organization.name,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: "Tu cuenta ha sido creada exitosamente!",
      template,
   });
}

export async function sendPreCongressInvitationEmail(userId: string, conferenceId: string) {
   const user = await getUserById(userId);

   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   console.log("PENDING IMPLEMENTATION: SEND EMAIL TO THE USER");

   const organization = await getOrganizationFromSubdomain();

   const conference = await getConferenceById(conferenceId);

   if (!conference) {
      console.log("Conference not found");
      return;
   }

   const template = await render(
      PreCongressInvitationTemplate({
         conferenceTitle: conference.title,
         conferenceDescription: conference.shortDescription || "",
         conferenceFormattedDate: format({
            date: conference.startTime,
            format: "DD MMM YYYY hh:mm A",
            tz: "America/Mexico_City",
         }),
         accessLink: "https://cmimcostachiapas.virtualis.app/lobby",
         organizationName: organization.name,
      }),
   );

   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   await sendNotificationEmail(
      `${organization.name} | Virtualis Congress`,
      user.email,
      "Invitación a la conferencia pre-congreso",
      template,
   );
}

export async function sendSpeakerRegistrationConfirmationEmail(userId: string) {
   const user = await getUserById(userId);

   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   // const organization = await getOrganizationFromSubdomain();

   console.log("PENDING IMPLEMENTATION: SEND EMAIL TO THE SPEAKER");
   // PENDING: SEND EMAIL HERE
}

export async function sendOTPCodeEmail(email: string, otpCode: string) {
   const user = await getUserByEmail(email);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const template = await render(
      OTPCodeTemplate({
         otpCode,
         organizationName: "Virtualis Congress",
         userEmail: email,
      }),
   );

   await sendNotificationEmail(
      `${organization.name} | Virtualis Congress`,
      email,
      "Código de verificación para Virtualis Congress",
      template,
   );

   console.log(`[EmailSendingServices] OTP code email sent successfully to ${user.email}`);
}

export async function sendPaymentConfirmationEmail(userId: UserRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }
   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const hasAccessToRecordings = await checkIfUserHasAccessToRecordings(user.id, congress.id);

   const modalitySelected = await getUserPurchasedModality(user.id, congress.id);

   if (!modalitySelected) {
      throw new Error("[EmailSendingServices] Modality not found");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      PaymentConfirmationTemplate({
         userName: user.name.split(" ")[0],
         congressTitle: congress.title,
         congressStartDate: format({
            date: congress.startDate,
            format: "DD MMMM",
            locale: "es-MX",
            tz: "America/Mexico_City",
         }),
         hasAccessToRecordings,
         modalitySelected,
         organizationName: organization.name,
         platformLink: `${organizationBaseUrl}/lobby`,
      }),
   );

   await sendNotificationEmail(
      `${organization.name} | Virtualis Congress`,
      user.email,
      `Confirmación de pago para ${congress.title}`,
      template,
   );

   if (user.additionalEmail1) {
      await sendNotificationEmail(
         `${organization.name} | Virtualis Congress`,
         user.additionalEmail1,
         `Confirmación de pago para ${congress.title}`,
         template,
      );
   }

   if (user.additionalEmail2) {
      await sendNotificationEmail(
         `${organization.name} | Virtualis Congress`,
         user.additionalEmail2,
         `Confirmación de pago para ${congress.title}`,
         template,
      );
   }
}

export async function sendRecordingInvitationEmail(recordingId: string, maxDeadline?: string) {
   const organization = await getOrganizationFromSubdomain();
   const simpleRecording = await getSimpleRecordingById(recordingId);

   if (!simpleRecording) {
      throw new Error(`[Recordings Services] Simple recording not found with id ${recordingId}`);
   }

   if (!simpleRecording.recorderEmail) {
      throw new Error(`[Recordings Services] Simple recording recorder email not found for recording id ${recordingId}`);
   }

   const emailSubject = `Invitación para grabar ${simpleRecording.title}`;
   const recordingLink = `${getRecordingLink(simpleRecording.id, organization)}`;

   const trackedEmailRecord = await createTrackedEmailRecord({
      sentTo: simpleRecording.recorderEmail,
      subject: emailSubject,
   });

   // Link the tracked email record to the recording
   await createRecordingTrackedEmailRecord({
      recordingId: simpleRecording.id,
      trackedEmailId: trackedEmailRecord.id,
      type: "invitation",
   });

   console.log("trackedEmailRecord", trackedEmailRecord);

   const baseTrackingUrl = IS_DEV_ENVIRONMENT
      ? `https://verified-properly-cheetah.ngrok-free.app`
      : `https://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}`;
   const trackingUrl = `${baseTrackingUrl}/api/email-track/${trackedEmailRecord.id}`;

   const inviteeName = simpleRecording.recorderName?.split(" ")[0] ?? "";

   const templateComponent =
      organization.shortID === "acp-wim"
         ? ACPWIMRecordingInvitationTemplate({
              inviteeName: inviteeName,
              recordingTitle: simpleRecording.title,
              recordingLink,
              trackingUrl,
              organizationName: organization.name,
              maxDeadline,
           })
         : RecordingInvitationTemplate({
              inviteeName: inviteeName,
              recordingTitle: simpleRecording.title,
              recordingLink,
              trackingUrl,
              organizationName: organization.name,
              maxDeadline,
           });

   const template = await render(templateComponent);

   try {
      await sendNotificationEmail(
         `${organization.name} | Virtualis Recordings`,
         simpleRecording.recorderEmail,
         emailSubject,
         template,
      );

      await updateTrackedEmailRecord({
         trackedEmailId: trackedEmailRecord.id,
         updatedData: {
            status: "sent",
            sentAt: new Date().toISOString(),
         },
      });

      await updateSimpleRecording(recordingId, {
         invitationEmailStatus: "sent",
      });
   } catch (error) {
      console.error("[Recordings Services] Error sending recording invitation email", error);
      if (error instanceof Error) {
         await updateTrackedEmailRecord({
            trackedEmailId: trackedEmailRecord.id,
            updatedData: {
               status: "errored",
               errorMessage: error.message,
            },
         });
      }
   }
}

export async function sendCoordinatorCVRecordingInvitationEmail(recordingId: string) {
   const organization = await getOrganizationFromSubdomain();

   const recording = await getSimpleRecordingById(recordingId);
   if (!recording) {
      throw new Error("[Recordings Services] Recording not found");
   }

   if (!recording.recorderEmail) {
      throw new Error(`[Recordings Services] Simple recording recorder email not found for recording id ${recordingId}`);
   }

   const conferenceSpeakerPresentationRecording = await getConferenceSpeakerPresentationRecordingRecordByRecordingId(recordingId);
   if (!conferenceSpeakerPresentationRecording) {
      throw new Error("[Recordings Services] Conference speaker presentation recording not found");
   }

   const conference = await getConferenceById(conferenceSpeakerPresentationRecording.conference);
   if (!conference) {
      throw new Error("[Recordings Services] Conference not found");
   }

   const conferenceSpeakers = await getConferenceSpeakers(conference.id);
   if (!conferenceSpeakers) {
      throw new Error("[Recordings Services] Speaker name not found");
   }

   const congress = await getCongressById(conference.congress);

   const speakerName = conferenceSpeakers.map((speaker) => speaker.displayName).join(", ");

   const coordinatorName = recording.recorderName ?? "Coordinador";

   const emailSubject = `Invitación para grabar la presentación de la conferencia | ${conference.title}`;

   const trackedEmailRecord = await createTrackedEmailRecord({
      sentTo: recording.recorderEmail,
      subject: emailSubject,
   });

   await createRecordingTrackedEmailRecord({
      recordingId: recording.id,
      trackedEmailId: trackedEmailRecord.id,
      type: "invitation",
   });

   const baseTrackingUrl = IS_DEV_ENVIRONMENT
      ? `https://verified-properly-cheetah.ngrok-free.app`
      : `https://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}`;
   const trackingUrl = `${baseTrackingUrl}/api/email-track/${trackedEmailRecord.id}`;

   const recordingURL = getRecordingLink(recording.id, organization);

   const template = await render(
      CoordinatorCVRecordingInvitationTemplate({
         congressTitle: congress?.title ?? "",
         conferenceTitle: conference.title,
         speakerName: speakerName,
         coordinatorName: coordinatorName,
         recordingUrl: recordingURL,
         trackingUrl,
      }),
   );

   await sendNotificationEmail(`${organization.name} | Virtualis Congress`, recording.recorderEmail, emailSubject, template);
   await updateTrackedEmailRecord({
      trackedEmailId: trackedEmailRecord.id,
      updatedData: {
         status: "sent",
         sentAt: new Date().toISOString(),
      },
   });

   await updateSimpleRecording(recordingId, {
      invitationEmailStatus: "sent",
   });
}

export async function sendRecordingReminderEmail(recordingId: SimpleRecordingRecord["id"]) {
   const recording = await getSimpleRecordingById(recordingId);
   const organization = await getOrganizationFromSubdomain();

   if (!recording) {
      throw new Error("[Recordings Services] Recording not found");
   }

   if (!recording.recorderEmail) {
      throw new Error(`[Recordings Services] Simple recording recorder email not found for recording id ${recordingId}`);
   }

   const emailSubject = `Recordatorio de entrega de grabación | ${recording.title}`;
   const recordingURL = getRecordingLink(recording.id, organization);

   const trackedEmailRecord = await createTrackedEmailRecord({
      sentTo: recording.recorderEmail,
      subject: emailSubject,
   });
   // Link the tracked email record to the recording
   await createRecordingTrackedEmailRecord({
      recordingId: recording.id,
      trackedEmailId: trackedEmailRecord.id,
      type: "reminder",
   });

   const baseTrackingUrl = IS_DEV_ENVIRONMENT
      ? `https://verified-properly-cheetah.ngrok-free.app`
      : `https://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}`;
   const trackingUrl = `${baseTrackingUrl}/api/email-track/${trackedEmailRecord.id}`;

   const template = await render(
      RecordingReminder({
         organizationName: organization.name,
         conferenceTitle: recording.title,
         speakerName: recording.recorderName ?? "",
         recordingUrl: recordingURL,
         trackingUrl,
      }),
   );

   try {
      await sendNotificationEmail(`${organization.name} | Virtualis Recordings`, recording.recorderEmail, emailSubject, template);

      await updateTrackedEmailRecord({
         trackedEmailId: trackedEmailRecord.id,
         updatedData: {
            status: "sent",
            sentAt: new Date().toISOString(),
         },
      });
   } catch (error) {
      console.error("[Recordings Services] Error sending recording reminder email", error);
      if (error instanceof Error) {
         await updateTrackedEmailRecord({
            trackedEmailId: trackedEmailRecord.id,
            updatedData: {
               status: "errored",
               errorMessage: error.message,
            },
         });
      }
   }
}

export async function sendNonPayersCongressInvitationEmail(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const congressFormattedStartDate = format({
      date: congress.startDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedStartTime = format({
      date: congress.startDate,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedEndDate = format({
      date: congress.finishDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedEndTime = format({
      date: congress.finishDate,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      NonPayersCongressInvitationTemplate({
         conferenceTitle: congress.title,
         conferenceFormattedStartDate: `Del ${congressFormattedStartDate} ${congressFormattedStartTime} al ${congressFormattedEndDate} ${congressFormattedEndTime}`,
         accessLink: `${organizationBaseUrl}/lobby`,
         organizationName: organization.name,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `Completa tu registro para ${congress.title}!`,
      template,
   });
}

export async function sendCourtesyInvitationEmail({
   to,
   promoCode,
   recipientName,
}: {
   to: string;
   promoCode: string;
   recipientName?: string;
}) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const congressFormattedStartDate = format({
      date: congress.startDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedStartTime = format({
      date: congress.startDate,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedEndDate = format({
      date: congress.finishDate,
      format: "DD MMMM",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const congressFormattedEndTime = format({
      date: congress.finishDate,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const organizationBaseUrl = await getOrganizationBaseUrl();
   const registrationLink = `${organizationBaseUrl}/lobby`;

   const template = await render(
      CourtesyInvitationEmailTemplate({
         recipientName,
         promoCode,
         congressTitle: congress.title,
         congressFormattedDates: `Del ${congressFormattedStartDate} ${congressFormattedStartTime} al ${congressFormattedEndDate} ${congressFormattedEndTime}`,
         registrationLink,
         organizationName: organization.name,
      }),
   );

   await sendNotificationEmail(
      `${organization.name} | Virtualis Congress`,
      to,
      `Invitación especial para acceder a ${congress.title}`,
      template,
   );
}

export async function sendAboutToStartEventEmail(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const congressFormattedStartDate = format({
      date: congress.startDate,
      format: "DD MMMM hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      AboutToStartEventTemplate({
         userName: user.name,
         eventTitle: congress.title,
         startTime: congressFormattedStartDate,
         joinURL: `${organizationBaseUrl}/lobby`,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `${congress.title} está por comenzar!`,
      template,
   });
}

export async function sendIphoneIssueSolvedEmail(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      IphoneIssueSolvedTemplate({
         userName: user.name,
         congressTitle: congress.title,
         platformLink: `${organizationBaseUrl}/lobby`,
         organizationName: organization.name,
      }),
   );

   await sendNotificationEmail(
      `${organization.name} | Virtualis Congress`,
      user.email,
      `Problema resuelto! Ya puedes entrar a la plataforma desde dispositivos iPhone`,
      template,
   );
}

export async function sendNewEventDayAboutToStartEmail(userId: string, eventDayNumber: 1 | 2 | 3 | 4 | 5 | 6) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const congressFormattedStartDate = format({
      date: congress.startDate,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      NewEventDayAboutToStartEmailTemplate({
         eventDayNumber,
         attendeeName: user.name,
         congressTitle: congress.title,
         joinUrl: `${organizationBaseUrl}/lobby`,
         startTime: congressFormattedStartDate,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `El día ${eventDayNumber} de ${congress.title} está por comenzar!`,
      template,
   });
}

export async function sendEventFinishedEmail(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const congressConferences = await getAllCongressConferences(congress.id);

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      EventFinishedTemplate({
         userName: user.name.split(" ")[0],
         congressTitle: congress.title,
         recordingsLink: `${organizationBaseUrl}/lobby`,
         organizationName: organization.name,
         totalConferences: congressConferences.length,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `${congress.title} fue todo un éxito! Ya puedes acceder a las grabaciones de las conferencias`,
      template,
   });
}

export async function sendSpeakerCertificateEmail({
   speakerName,
   academicTitle,
   email,
}: {
   speakerName: string;
   academicTitle: string;
   email: string;
}) {
   const organization = await getOrganizationFromSubdomain();
   const user = await getUserByEmail(email);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      SpeakerCertificateTemplate({
         speakerName,
         academicTitle,
         congressTitle: congress.title,
         certificateUrl: `${organizationBaseUrl}/certificates/speaker-certificate`,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: email,
      subject: `Tu certificado de ponente está disponible!`,
      template,
   });
}

export async function sendOnDemandReminderEmail({ userId, bannerImageUrl }: { userId: string; bannerImageUrl?: string }) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error("[EmailSendingServices] Congress not found");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const template = await render(
      OnDemandReminderTemplate({
         userName: user.name.split(" ")[0],
         conferenceTitle: congress.title,
         bannerImageUrl,
         accessLink: `${organizationBaseUrl}/lobby`,
         organizationName: organization.name,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `${congress.title} ya está disponible bajo demanda!`,
      template,
   });
}

export async function sendSpeakerPresentationUploadReminderEmail({
   userId,
   conferenceId,
}: {
   userId: string;
   conferenceId: string;
}) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("[EmailSendingServices] User not found");
   }

   const organization = await getOrganizationFromSubdomain();
   if (!organization) {
      throw new Error("[EmailSendingServices] Organization not found");
   }

   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      throw new Error("[EmailSendingServices] Conference not found");
   }

   if (conference.conferenceType !== "in-person" && conference.conferenceType !== "livestream") {
      throw new Error("[EmailSendingServices] Conference is not a live conference this should not apply");
   }

   const organizationBaseUrl = await getOrganizationBaseUrl();

   const formattedConferenceDate = format({
      date: conference.startTime,
      format: "DD/MMM/YYYY",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const formattedDeadlineDate = format({
      date: addDay(conference.startTime, -1),
      format: "DD/MMM/YYYY",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   const template = await render(
      SpeakerPresentationUploadReminderTemplate({
         speakerName: user.name,
         conferenceTitle: conference.title,
         uploadLink: `${organizationBaseUrl}/speakers/slides/${conference.id}/upload`,
         organizationName: organization.name,
         deadlineDate: formattedDeadlineDate,
         conferenceDate: formattedConferenceDate,
      }),
   );

   await sendEmailToAllEmailsOfTheUser({
      user,
      senderAlias: `${organization.name} | Virtualis Congress`,
      to: user.email,
      subject: `Recuerda subir la presentación para tu conferencia: ${conference.title}!`,
      template,
   });
}
