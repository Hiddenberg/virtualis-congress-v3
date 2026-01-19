"use server";

import {
   getAllCongressRegistrations,
   getAllCongressRegistrationsWithUsers,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   sendAboutToStartEventEmail,
   sendEventFinishedEmail,
   sendIphoneIssueSolvedEmail,
   sendNewEventDayAboutToStartEmail,
   sendNonPayersCongressInvitationEmail,
   sendOnDemandReminderEmail,
   sendSpeakerCertificateEmail,
} from "@/features/emails/services/emailSendingServices";
import { getAllOrganizationCompletedPaymentsWithUsers } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getAllSimpleRecordings } from "@/features/simpleRecordings/services/recordingsServices";
import {
   createRecordingTrackedEmailRecord,
   getRecordingTrackedEmails,
} from "@/features/simpleRecordings/services/recordingTrackedEmailsServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import {
   createTrackedEmailRecord,
   updateTrackedEmailRecord,
} from "@/features/trackedEmails/services/trackedEmailServices";
import { checkUserAuthorization } from "@/features/users/services/userServices";
import { getAllSpeakersDetails } from "@/features/users/speakers/services/speakerServices";
import { getAllUsersWithoutPayments } from "../services/superAdminServices";

// These functions are used to perform actions that affect the entire platform or organization and require super admin privileges
// Most of these function should be indempotent and can be run multiple times without causing issues

async function checkIfUserIsSuperAdmin() {
   const userId = await getLoggedInUserId();
   const isAuthorized = await checkUserAuthorization(userId ?? "", [
      "super_admin",
   ]);
   if (!isAuthorized) {
      throw new Error("User is not authorized to perform this action");
   }
}

interface SkippedRecording {
   id: string;
   reason: string;
}
interface ErroredRecording {
   id: string;
   errorMessage: string;
}
export async function migrateAllRecordingEmailsAction(): Promise<
   BackendResponse<{
      skippedRecordings: SkippedRecording[];
      erroredRecordings: ErroredRecording[];
      migratedRecordingEmails: string[];
   }>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const allRecordings = await getAllSimpleRecordings();

      const skippedRecordings: SkippedRecording[] = [];
      const erroredRecordings: ErroredRecording[] = [];
      const migratedRecordingEmails = [];

      for (const recording of allRecordings) {
         try {
            // Check if the recording has already been migrated
            // Check if it already has a tracked email
            const recordingTrackedEmails = await getRecordingTrackedEmails(
               recording.id,
            );
            if (recordingTrackedEmails.length > 0) {
               // skip
               skippedRecordings.push({
                  id: recording.id,
                  reason: "Already has tracked emails",
               });
               continue;
            }

            const invitationEmailStatus = recording.invitationEmailStatus;
            if (invitationEmailStatus === "not_sent") {
               // skip
               skippedRecordings.push({
                  id: recording.id,
                  reason:
                     "This recording does not have an invitation email sent yet",
               });
               continue;
            }

            if (invitationEmailStatus === "sent") {
               // migrate

               // Create tracked email record
               const trackedEmailRecord = await createTrackedEmailRecord({
                  sentTo: recording.recorderEmail,
                  subject: `Invitación para grabar ${recording.title}`,
               });

               // Update the recording invitation email status
               await updateTrackedEmailRecord({
                  trackedEmailId: trackedEmailRecord.id,
                  updatedData: {
                     status: "sent",
                     sentAt: new Date("2025-10-01").toISOString(),
                  },
               });

               // Link the tracked email record to the recording
               await createRecordingTrackedEmailRecord({
                  recordingId: recording.id,
                  trackedEmailId: trackedEmailRecord.id,
                  type: "invitation",
               });

               migratedRecordingEmails.push(recording.id);
            }

            if (invitationEmailStatus === "opened") {
               // migrate

               if (!recording.invitationEmailOpenedAt) {
                  // skip
                  erroredRecordings.push({
                     id: recording.id,
                     errorMessage:
                        "The recording invitation email status is opened but no invitation email opened at is set",
                  });
                  continue;
               }

               // Create tracked email record
               const trackedEmailRecord = await createTrackedEmailRecord({
                  sentTo: recording.recorderEmail,
                  subject: `Invitación para grabar ${recording.title}`,
               });

               // Update the recording invitation email status
               await updateTrackedEmailRecord({
                  trackedEmailId: trackedEmailRecord.id,
                  updatedData: {
                     status: "opened",
                     openedAt: recording.invitationEmailOpenedAt,
                     sentAt: new Date("2025-10-01").toISOString(),
                  },
               });

               // Link the tracked email record to the recording
               await createRecordingTrackedEmailRecord({
                  recordingId: recording.id,
                  trackedEmailId: trackedEmailRecord.id,
                  type: "invitation",
               });

               migratedRecordingEmails.push(recording.id);
            }
         } catch (error) {
            if (error instanceof Error) {
               erroredRecordings.push({
                  id: recording.id,
                  errorMessage: error.message,
               });
            }
         }
      }

      return {
         success: true,
         data: {
            migratedRecordingEmails,
            erroredRecordings,
            skippedRecordings,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

interface EmailError {
   user: string;
   errorMessage: string;
}

interface NonPayersCongressInvitationEmailsToNonPayersActionResponse {
   usersRegistered: number;
   usersWithPaymentsConfirmed: number;
   usersWithoutPayments: number;
   emailsSent: number;
   emailsErrored: number;
   emailErrors: EmailError[];
}

let emailsSent = false;
export async function sendCongressInvitationEmailsToNonPayersAction(): Promise<
   BackendResponse<NonPayersCongressInvitationEmailsToNonPayersActionResponse>
> {
   try {
      if (emailsSent === true) {
         return {
            success: false,
            errorMessage: "Emails already sent",
         };
      }

      const organization = await getOrganizationFromSubdomain();
      if (!organization) {
         throw new Error("Organization not found");
      }

      const congress = await getLatestCongress();
      if (!congress) {
         throw new Error("Congress not found");
      }

      const congressRegistrations =
         await getAllCongressRegistrationsWithUsers();
      const completedPayments =
         await getAllOrganizationCompletedPaymentsWithUsers();

      const nonPayersCongressRegistrations = congressRegistrations.filter(
         (registration) =>
            !completedPayments.some(
               (payment) => payment.user === registration.user,
            ),
      );

      const emailsSentArray = [];
      const emailsErroredArray: {
         user: string;
         errorMessage: string;
      }[] = [];

      for (const registration of nonPayersCongressRegistrations) {
         try {
            console.log(
               "Sending invitation email to non payer",
               registration.user,
            );
            await sendNonPayersCongressInvitationEmail(registration.user);
            emailsSentArray.push(registration.user);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      emailsSent = true;

      return {
         success: true,
         successMessage: `${congressRegistrations.length} users registered, ${completedPayments.length} users with payments confirmed, ${congressRegistrations.length - completedPayments.length} users without payments, ${emailsSentArray.length} emails sent, ${emailsErroredArray.length} emails errored`,
         data: {
            usersRegistered: congressRegistrations.length,
            usersWithPaymentsConfirmed: completedPayments.length,
            usersWithoutPayments:
               congressRegistrations.length - completedPayments.length,
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function testSendCongressInvitationEmailToNonPayerAction(
   userId: string,
): Promise<BackendResponse<null>> {
   try {
      await checkIfUserIsSuperAdmin();

      await sendNonPayersCongressInvitationEmail(userId);

      return {
         success: true,
         successMessage: "Email sent",
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

interface SendAboutToStartEventEmailToAllUsersActionResponse {
   emailsSent: number;
   emailsErrored: number;
   emailErrors: EmailError[];
}
export async function sendAboutToStartEventEmailToAllUsersAction(): Promise<
   BackendResponse<SendAboutToStartEventEmailToAllUsersActionResponse>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const allCongressUsers = await getAllCongressRegistrations();

      const emailsSentArray = [];
      const emailsErroredArray: {
         user: string;
         errorMessage: string;
      }[] = [];

      for (const registration of allCongressUsers) {
         try {
            await sendAboutToStartEventEmail(registration.user);
            emailsSentArray.push(registration.id);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      return {
         success: true,
         successMessage: "Emails sent",
         data: {
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

interface SendIphoneIssueSolvedEmailToAllUsersActionResponse {
   emailsSent: number;
   emailsErrored: number;
   emailErrors: EmailError[];
}
export async function sendIphoneIssueSolvedEmailToAllUsersAction(): Promise<
   BackendResponse<SendIphoneIssueSolvedEmailToAllUsersActionResponse>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const allUsersWithPayment =
         await getAllOrganizationCompletedPaymentsWithUsers();

      const emailsSentArray = [];
      const emailsErroredArray: EmailError[] = [];

      for (const user of allUsersWithPayment) {
         try {
            await sendIphoneIssueSolvedEmail(user.user);
            emailsSentArray.push(user.user);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: user.user,
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: user.user,
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }
      return {
         success: true,
         successMessage: "Emails sent to all users with payment",
         data: {
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

interface SendNewEventDayAboutToStartEmailToAllUsersActionResponse {
   emailsSent: number;
   emailsErrored: number;
   emailErrors: EmailError[];
}
export async function sendNewEventDayAboutToStartEmailToAllUsersAction(
   eventDayNumberString: string,
): Promise<
   BackendResponse<SendNewEventDayAboutToStartEmailToAllUsersActionResponse>
> {
   try {
      await checkIfUserIsSuperAdmin();

      if (typeof eventDayNumberString !== "string") {
         return {
            success: false,
            errorMessage: "Event day number must be a string",
         };
      }

      const eventDayNumber = parseInt(eventDayNumberString);

      if (eventDayNumber < 1 || eventDayNumber > 6) {
         return {
            success: false,
            errorMessage: "Invalid event day number",
         };
      }

      const allCongressUsers = await getAllCongressRegistrations();

      const emailsSentArray = [];
      const emailsErroredArray: EmailError[] = [];

      for (const registration of allCongressUsers) {
         try {
            await sendNewEventDayAboutToStartEmail(
               registration.user,
               eventDayNumber as 1 | 2 | 3 | 4 | 5 | 6,
            );
            emailsSentArray.push(registration.user);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: registration.user,
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      return {
         success: true,
         successMessage: "Emails sent to all users",
         data: {
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendEventFinishedEmailToAllUsersAction(): Promise<
   BackendResponse<unknown>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const allCongressUsers = await getAllCongressRegistrations();

      const emailsSentArray = [];
      const emailsErroredArray: EmailError[] = [];

      for (const user of allCongressUsers) {
         try {
            await sendEventFinishedEmail(user.user);
            emailsSentArray.push(user.user);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: user.user,
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: user.user,
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      return {
         success: true,
         successMessage: "Emails sent to all users",
         data: {
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendSpeakerCertificateEmailToAllSpeakersAction(): Promise<
   BackendResponse<unknown>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const allSpeakers = await getAllSpeakersDetails();

      console.log(allSpeakers);
      console.log("speakers count", allSpeakers.length);

      const emailsSentArray = [];
      const emailsErroredArray: EmailError[] = [];

      for (const speaker of allSpeakers) {
         try {
            await sendSpeakerCertificateEmail({
               speakerName: speaker.name,
               academicTitle: speaker.academicTitle || "",
               email: speaker.email || "",
            });
            emailsSentArray.push(speaker.email);
         } catch (error) {
            console.error(
               "Error sending speaker certificate email to",
               speaker.email,
               error,
            );
            emailsErroredArray.push({
               user: speaker.email || "",
               errorMessage:
                  error instanceof Error
                     ? error.message
                     : "An unknown error occurred",
            });
         }
      }

      return {
         success: true,
         successMessage: "Emails sent to all speakers",
         data: {
            emailsSent: allSpeakers.length,
            emailsErrored: 0,
            emailErrors: [],
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendOnDemandReminderEmailsToAllUsersWithoutPaymentsAction(): Promise<
   BackendResponse<unknown>
> {
   try {
      await checkIfUserIsSuperAdmin();

      const usersWithoutPayments = await getAllUsersWithoutPayments();

      const emailsSentArray = [];
      const emailsErroredArray: EmailError[] = [];

      for (const user of usersWithoutPayments) {
         try {
            await sendOnDemandReminderEmail({
               userId: user.id,
            });
            emailsSentArray.push(user.id);
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: user.id,
                  errorMessage: error.message,
               });
            }
         }
      }

      return {
         success: true,
         successMessage: `${usersWithoutPayments.length} users without payments, ${emailsSentArray.length} emails sent, ${emailsErroredArray.length} emails errored`,
         data: {
            emailsSent: emailsSentArray.length,
            emailsErrored: emailsErroredArray.length,
            emailErrors: emailsErroredArray,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}
