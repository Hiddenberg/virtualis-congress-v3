"use server";

import { revalidatePath } from "next/cache";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import { getAllCongressConferences, getConferenceById } from "@/features/conferences/services/conferenceServices";
import { createLivestreamMuxAsset, getQnALivestreamMuxAssetForConference } from "@/services/livestreamMuxAssetServices";
import {
   checkIfConferenceHasQnALivestreamSession,
   createLivestreamSession,
   getQnALivestreamSessionForConference,
   updateLivestreamSessionAttendantStatus,
   updateLivestreamSessionStatus,
   updateLivestreamSessionZoomLink,
} from "@/services/livestreamSessionServices";
import { createMuxLiveStream } from "@/services/muxServices";
import {
   startZoomSessionLiveStream,
   stopZoomSessionLiveStream,
   updateZoomSessionLiveStream,
} from "@/services/zoomVideoSDKServices";

export async function assignQnALivestreamSessionsToAllConferencesAction() {
   try {
      const conferences = await getAllCongressConferences(TEMP_CONSTANTS.CONGRESS_ID);

      const skippedConferences = [];
      const preparedConferences = [];
      const errorConferences = [];
      const updatedConferences = [];

      for (const conference of conferences) {
         try {
            const conferenceIsAlreadyPrepared = await checkIfConferenceHasQnALivestreamSession(conference.id);

            if (conferenceIsAlreadyPrepared) {
               skippedConferences.push({
                  conferenceId: conference.id,
                  conferenceTitle: conference.title,
               });

               const livestreamSession = await getQnALivestreamSessionForConference(conference.id);
               // console.log(typeof livestreamSession?.attendantStatus)
               if (livestreamSession && livestreamSession.attendantStatus === ("" as unknown)) {
                  await updateLivestreamSessionAttendantStatus(livestreamSession.id, "scheduled");
                  updatedConferences.push({
                     conferenceId: conference.id,
                     conferenceTitle: conference.title,
                  });
               }

               continue;
            }

            const livestreamSession = await createLivestreamSession(conference.id);

            const muxLiveStream = await createMuxLiveStream(`Live for conf: ${conference.id}`);
            await createLivestreamMuxAsset({
               conferenceId: conference.id,
               livestreamSessionId: livestreamSession.id,
               muxLivestreamId: muxLiveStream.id,
               livestreamPlaybackId: muxLiveStream.playback_ids![0].id,
               streamKey: muxLiveStream.stream_key,
            });

            preparedConferences.push({
               conferenceId: conference.id,
               conferenceTitle: conference.title,
            });
         } catch (error) {
            errorConferences.push({
               conferenceId: conference.id,
               conferenceTitle: conference.title,
               error: error,
            });
         }
      }

      revalidatePath("/QnA-transmission");
      return {
         message: `Se asignaron sesiones de QnA a ${preparedConferences.length} conferencias. ${skippedConferences.length} conferencias ya tenían sesiones de QnA asignadas. ${updatedConferences.length} conferencias se actualizó el estado de la sesión de QnA. ${errorConferences.length} conferencias no pudieron ser preparadas.`,
         skippedConferences,
         preparedConferences,
         updatedConferences,
         errorConferences,
      };
   } catch (error) {
      console.error("[Livestream Actions] Error assigning QnA livestream sessions to all conferences", error);
      throw error;
   }
}

export async function updateLivestreamSessionStatusAction(conferenceId: string, status: LivestreamSession["status"]) {
   try {
      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);

      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      await updateLivestreamSessionStatus(livestreamSession.id, status);

      return {
         success: true,
         message: "Se actualizó el estado de la sesión de QnA",
      };
   } catch (error) {
      console.error("[Livestream Actions] Error updating livestream session status", error);
      return {
         success: false,
         error: "Error al actualizar el estado de la sesión de QnA",
      };
   }
}

export async function startQnALivestreamSessionAction(conferenceId: string, zoomSessionId: string) {
   try {
      const conference = await getConferenceById(conferenceId);
      if (!conference) {
         return {
            success: false,
            error: "No se encontró la conferencia",
         };
      }

      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);
      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      const livestreamMuxAsset = await getQnALivestreamMuxAssetForConference(conferenceId);
      if (!livestreamMuxAsset) {
         return {
            success: false,
            error: "No se encontró el MUX asset de QnA para la conferencia",
         };
      }

      const { success, message } = await updateZoomSessionLiveStream(
         zoomSessionId,
         TEMP_CONSTANTS.MUX_RTMP_URL,
         livestreamMuxAsset.streamKey,
      );
      if (!success) {
         return {
            success: false,
            error: message,
         };
      }

      const { success: startZoomSessionLiveSuccess, message: startZoomSessionLiveMessage } = await startZoomSessionLiveStream(
         zoomSessionId,
         conference.title,
      );
      if (!startZoomSessionLiveSuccess) {
         return {
            success: false,
            error: startZoomSessionLiveMessage,
         };
      }

      await updateLivestreamSessionStatus(livestreamSession.id, "streaming");

      return {
         success: true,
         message: "Se inició el stream de Zoom",
      };
   } catch (error) {
      console.error("[Livestream Actions] Error starting QnA livestream session", error);
      return {
         success: false,
         error: "Error al iniciar el stream de Zoom",
      };
   }
}

export async function stopQnALivestreamSessionAction(conferenceId: string, zoomSessionId: string) {
   try {
      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);
      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      const { success: stopZoomSessionLiveSuccess, message: stopZoomSessionLiveMessage } =
         await stopZoomSessionLiveStream(zoomSessionId);
      if (!stopZoomSessionLiveSuccess) {
         return {
            success: false,
            error: stopZoomSessionLiveMessage,
         };
      }

      await updateLivestreamSessionStatus(livestreamSession.id, "ended");

      return {
         success: true,
         message: "Se detuvo el stream de Zoom",
      };
   } catch (error) {
      console.error("[Livestream Actions] Error stopping QnA livestream session", error);
      return {
         success: false,
         error: "Error al detener el stream de Zoom",
      };
   }
}

export async function moveToZoomAction(conferenceId: string, zoomLink: string) {
   try {
      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);
      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      await updateLivestreamSessionZoomLink(livestreamSession.id, zoomLink);
      // await updateLivestreamSessionStatus(livestreamSession.id, "moved_to_zoom")

      return {
         success: true,
         message: "Se movió la sesión de preguntas y respuestas a Zoom",
      };
   } catch (error) {
      console.error("[Livestream Actions] Error moving QnA livestream session to Zoom", error);
      return {
         success: false,
         error: "Error al mover la sesión de preguntas y respuestas a Zoom",
      };
   }
}

export async function getLivestreamSessionZoomLinkAction(conferenceId: string) {
   try {
      console.log("getting livestream session zoom link");
      console.log(conferenceId);
      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);

      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      if (!livestreamSession.zoomEmergencyLink) {
         return {
            success: false,
            error: "No se encontró el enlace de Zoom para la sesión de QnA",
         };
      }

      return {
         success: true,
         zoomLink: livestreamSession.zoomEmergencyLink,
      };
   } catch (error) {
      console.error("[Livestream Actions] Error getting livestream session zoom link", error);
      return {
         success: false,
         error: "Error al obtener el enlace de Zoom",
      };
   }
}

export async function cancelQnALivestreamSessionAction(conferenceId: string) {
   try {
      const livestreamSession = await getQnALivestreamSessionForConference(conferenceId);
      if (!livestreamSession) {
         return {
            success: false,
            error: "No se encontró la sesión de QnA para la conferencia",
         };
      }

      // await updateLivestreamSessionStatus(livestreamSession.id, "canceled")

      return {
         success: true,
         message: "Se canceló la sesión de QnA",
      };
   } catch (error) {
      console.error("[Livestream Actions] Error canceling QnA livestream session", error);
      return {
         success: false,
         error: "Error al cancelar la sesión de QnA",
      };
   }
}
