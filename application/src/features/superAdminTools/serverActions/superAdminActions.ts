"use server";

import { getAllLiveConferences } from "@/features/conferences/services/conferenceServices";
import { getConferenceSpeakers } from "@/features/conferences/services/conferenceSpeakersServices";
import {
   getAllCongressRegistrations,
   getAllCongressRegistrationsWithUsers,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   createSingleCourtesyInvitationAndSendEmail,
   getCourtesyInvitationBySentToEmail,
} from "@/features/courtesyInvitations/services/courtesyInvitationServices";
import {
   sendAboutToStartEventEmail,
   sendEventFinishedEmail,
   sendIphoneIssueSolvedEmail,
   sendLiveConferenceSpeakerInvitationEmail,
   sendNewEventDayAboutToStartEmail,
   sendNonPayersCongressInvitationEmail,
   sendOnDemandReminderEmail,
   sendSpeakerCertificateEmail,
} from "@/features/emails/services/emailSendingServices";
import { getAllOrganizationCompletedPaymentsWithUsers } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkUserAuthorization } from "@/features/users/services/userServices";
import { getAllSpeakersDetails } from "@/features/users/speakers/services/speakerServices";
import { getAllUsersWithoutPayments } from "../services/superAdminServices";

// These functions are used to perform actions that affect the entire platform or organization and require super admin privileges
// Most of these function should be indempotent and can be run multiple times without causing issues

async function checkIfUserIsSuperAdmin() {
   const userId = await getLoggedInUserId();
   const isAuthorized = await checkUserAuthorization(userId ?? "", ["super_admin"]);
   if (!isAuthorized) {
      throw new Error("User is not authorized to perform this action");
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

      const congressRegistrations = await getAllCongressRegistrationsWithUsers();
      const completedPayments = await getAllOrganizationCompletedPaymentsWithUsers();

      const nonPayersCongressRegistrations = congressRegistrations.filter(
         (registration) => !completedPayments.some((payment) => payment.user === registration.user),
      );

      const emailsSentArray = [];
      const emailsErroredArray: {
         user: string;
         errorMessage: string;
      }[] = [];

      for (const registration of nonPayersCongressRegistrations) {
         try {
            console.log("Sending invitation email to non payer", registration.user);
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
            usersWithoutPayments: congressRegistrations.length - completedPayments.length,
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

export async function testSendCongressInvitationEmailToNonPayerAction(userId: string): Promise<BackendResponse<null>> {
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

      const allUsersWithPayment = await getAllOrganizationCompletedPaymentsWithUsers();

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
): Promise<BackendResponse<SendNewEventDayAboutToStartEmailToAllUsersActionResponse>> {
   try {
      await checkIfUserIsSuperAdmin();

      if (typeof eventDayNumberString !== "string") {
         return {
            success: false,
            errorMessage: "Event day number must be a string",
         };
      }

      const eventDayNumber = parseInt(eventDayNumberString, 10);

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
            await sendNewEventDayAboutToStartEmail(registration.user, eventDayNumber as 1 | 2 | 3 | 4 | 5 | 6);
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

export async function sendEventFinishedEmailToAllUsersAction(): Promise<BackendResponse<unknown>> {
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

export async function sendSpeakerCertificateEmailToAllSpeakersAction(): Promise<BackendResponse<unknown>> {
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
            console.error("Error sending speaker certificate email to", speaker.email, error);
            emailsErroredArray.push({
               user: speaker.email || "",
               errorMessage: error instanceof Error ? error.message : "An unknown error occurred",
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

export async function sendOnDemandReminderEmailsToAllUsersWithoutPaymentsAction(): Promise<BackendResponse<unknown>> {
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

export async function sendCourtesyInvitationEmailsToAllSpeakersAction(): Promise<BackendResponse<unknown>> {
   try {
      await checkIfUserIsSuperAdmin();

      const allSpeakers = await getAllSpeakersDetails();

      const emailsSentArray: {
         speakerName: string;
         speakerEmail: string;
      }[] = [];
      const emailsSkippedArray: {
         speakerName: string;
         speakerEmail: string;
         reason: string;
      }[] = [];
      const emailsErroredArray: EmailError[] = [];

      for (const speakerDetails of allSpeakers) {
         try {
            if (!speakerDetails.email) {
               emailsSkippedArray.push({
                  speakerName: speakerDetails.name,
                  speakerEmail: speakerDetails.email || "",
                  reason: "Speaker email not found",
               });
               continue;
            }

            const existingCourtesyInvitation = await getCourtesyInvitationBySentToEmail(speakerDetails.email);
            if (existingCourtesyInvitation) {
               emailsSkippedArray.push({
                  speakerName: speakerDetails.name,
                  speakerEmail: speakerDetails.email || "",
                  reason: "Speaker already has a courtesy invitation",
               });
               continue;
            }

            await createSingleCourtesyInvitationAndSendEmail({
               email: speakerDetails.email,
               recipientName: speakerDetails.name,
               tag: "Invitación de ponente",
            });

            emailsSentArray.push({
               speakerEmail: speakerDetails.email,
               speakerName: speakerDetails.name,
            });
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: speakerDetails.email || "",
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: speakerDetails.email || "",
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      return {
         success: true,
         successMessage: `${allSpeakers.length} speakers, ${emailsSentArray.length} emails sent, ${emailsSkippedArray.length} emails skipped, ${emailsErroredArray.length} emails errored`,
         data: {
            emailsSent: emailsSentArray,
            emailsSkipped: emailsSkippedArray,
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

export async function sendLiveConferenceSpeakerInvitationEmailsToAllSpeakersAction(): Promise<BackendResponse<unknown>> {
   try {
      const congress = await getLatestCongress();
      const liveConferences = await getAllLiveConferences(congress.id);

      const emailsSentArray: {
         conferenceId: string;
         conferenceTitle: string;
         userId: string;
      }[] = [];
      const emailsSkippedArray: {
         conferenceId: string;
         conferenceTitle: string;
         reason: string;
      }[] = [];
      const emailsErroredArray: EmailError[] = [];

      for (const conference of liveConferences) {
         try {
            if (conference.conferenceType !== "in-person" && conference.conferenceType !== "livestream") {
               emailsSkippedArray.push({
                  conferenceId: conference.id,
                  conferenceTitle: conference.title,
                  reason: "Conference is not a live conference",
               });
               continue;
            }

            const conferenceSpeakers = await getConferenceSpeakers(conference.id);
            if (conferenceSpeakers.length === 0) {
               emailsSkippedArray.push({
                  conferenceId: conference.id,
                  conferenceTitle: conference.title,
                  reason: "No speakers found for the conference",
               });
               continue;
            }

            for (const speaker of conferenceSpeakers) {
               if (!speaker.user) {
                  emailsSkippedArray.push({
                     conferenceId: conference.id,
                     conferenceTitle: conference.title,
                     reason: `Speaker ${speaker.displayName} has no user account associated`,
                  });
                  continue;
               }

               await sendLiveConferenceSpeakerInvitationEmail({
                  conferenceId: conference.id,
                  userId: speaker.user,
               });

               emailsSentArray.push({
                  conferenceId: conference.id,
                  conferenceTitle: conference.title,
                  userId: speaker.user,
               });
            }
         } catch (error) {
            if (error instanceof Error) {
               emailsErroredArray.push({
                  user: "Unknown",
                  errorMessage: error.message,
               });
            } else {
               emailsErroredArray.push({
                  user: "Unknown",
                  errorMessage: "An unknown error occurred",
               });
            }
         }
      }

      return {
         success: true,
         successMessage: `${liveConferences.length} live conferences, ${emailsSentArray.length} emails sent, ${emailsSkippedArray.length} emails skipped, ${emailsErroredArray.length} emails errored`,
         data: {
            emailsSent: emailsSentArray,
            emailsSkipped: emailsSkippedArray,
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
      console.error("[sendLiveConferenceSpeakerInvitationEmailsToAllSpeakersAction] An unknown error occurred", error);
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}
