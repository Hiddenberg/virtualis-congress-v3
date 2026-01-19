"use server";

import { revalidatePath } from "next/cache";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { sendRecordingReminderEmail } from "@/features/emails/services/emailSendingServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import {
   sendInaugurationMessageRecordingInvitationMail,
   sendIndividualConferenceRecordingInvitationMail,
   sendPresentationRecordingInvitationMail,
   sendReRecordingEmail,
} from "@/services/emailServices";
import {
   addRecordingReminderCount,
   getRecordingById,
   updateRecordingInvitationSentStatus,
   updateReRecordingEmailSentStatus,
} from "@/services/recordingServices";

export async function sendRecordingInvitationMailAction(recordingId: string) {
   const isAuthorizedUser = await checkAuthorizedUserFromServer([
      "admin",
      "super_admin",
   ]);

   if (!isAuthorizedUser) {
      return {
         error: "Unauthorized",
      };
   }

   const recording = await getRecordingById(recordingId);

   if (!recording) {
      return {
         error: "Recording not found",
      };
   }

   if (recording.recordingType === "conference") {
      await sendIndividualConferenceRecordingInvitationMail(
         recording.conference,
      );
      await updateRecordingInvitationSentStatus(recordingId, true);

      revalidatePath(
         "/congress-admin/conference-calendar/[conferenceDate]",
         "layout",
      );
      return {
         success: true,
         message:
            "Invitación para grabación de conferencia enviada correctamente",
      };
   } else if (recording.recordingType === "presentation") {
      const recording = await getRecordingById(recordingId);
      if (!recording) {
         return {
            error: "Recording not found",
         };
      }
      if (recording.usersWhoWillRecord.length === 0) {
         return {
            error: "No se puede enviar la invitación si no hay presentadores asignados",
         };
      }

      const conference = await getConferenceById(recording.conference);
      if (!conference) {
         return {
            error: "Conferencia no encontrada",
         };
      }
      if (conference.title === "Mensaje De Inauguración") {
         await sendInaugurationMessageRecordingInvitationMail(
            recording.conference,
         );
      } else {
         await sendPresentationRecordingInvitationMail(recording.conference);
      }
      await updateRecordingInvitationSentStatus(recordingId, true);
      revalidatePath(
         "/congress-admin/conference-calendar/[conferenceDate]",
         "layout",
      );

      return {
         success: true,
         message:
            "Invitación para grabación de presentación enviada correctamente",
      };
   }

   return {
      error: "Invalid recording type",
   };
}

export async function sendRecordingReminderMailAction(recordingId: string) {
   try {
      const isAuthorizedUser = await checkAuthorizedUserFromServer([
         "admin",
         "super_admin",
      ]);

      if (!isAuthorizedUser) {
         return {
            error: "Unauthorized",
         };
      }

      const recording = await getRecordingById(recordingId);

      if (!recording) {
         return {
            error: "Recording not found",
         };
      }

      if (recording.usersWhoWillRecord.length === 0) {
         return {
            error: "No se puede enviar el recordatorio si no hay alguien asignado para grabar",
         };
      }

      await sendRecordingReminderEmail(recordingId);
      await addRecordingReminderCount(recordingId);

      revalidatePath(
         "/congress-admin/conference-calendar/[conferenceDate]",
         "layout",
      );

      return {
         success: true,
         message: "Recordatorio de grabación enviado correctamente",
      };
   } catch (error) {
      console.error("Error sending recording reminder mail: ", error);
      return {
         error: "Error sending recording reminder mail",
      };
   }
}

export async function sendReRecordingMailAction(recordingId: string) {
   try {
      const isAuthorizedUser = await checkAuthorizedUserFromServer([
         "admin",
         "super_admin",
      ]);

      if (!isAuthorizedUser) {
         return {
            error: "Unauthorized",
         };
      }

      await sendReRecordingEmail(recordingId);
      await updateReRecordingEmailSentStatus(recordingId, true);
      revalidatePath(
         "/congress-admin/conference-calendar/[conferenceDate]",
         "layout",
      );

      return {
         success: true,
         message: "Re-recording email sent correctly",
      };
   } catch (error) {
      console.error("Error sending re-recording mail: ", error);
      return {
         error: "Error sending re-recording mail",
      };
   }
}
