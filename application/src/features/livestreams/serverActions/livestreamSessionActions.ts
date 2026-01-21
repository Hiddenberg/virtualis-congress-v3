"use server";

import { revalidatePath } from "next/cache";
import { prepareZoomSessionLiveStream, startZoomSessionLiveStream, stopZoomSessionLiveStream } from "@/libs/zoomVideoSDKAPI";
import { MUX_RTMP_URL } from "../constants/livestreamConstants";
import {
   createLivestreamSession,
   getLivestreamSessionById,
   updateLivestreamSession,
} from "../services/livestreamSessionServices";
import {
   completeMuxLivestream,
   createMuxLivestream,
   getMuxLivestreamRecordByLivestreamSessionId,
} from "../services/muxLivestreamServices";

export async function createLivestreamAction() {
   const createdLivestreamSession = await createLivestreamSession();
   await createMuxLivestream(createdLivestreamSession.id);

   return createdLivestreamSession;
}

export async function startPreparingLivestreamSessionAction(livestreamSessionId: string) {
   // const userId = await getLoggedInUserId()

   // if (!userId) {
   //    return {
   //       errorMessage: "No estás autorizado para iniciar la preparación de la sesión de transmisión"
   //    }
   // }

   // const isAuthorized = await checkUserAuthorization(userId, ["admin", "super_admin"])

   // if (!isAuthorized) {
   //    return {
   //       errorMessage: "No estás autorizado para iniciar la preparación de la sesión de transmisión"
   //    }
   // }

   const livestreamSession = await getLivestreamSessionById(livestreamSessionId);

   if (!livestreamSession) {
      console.error(`[Livestream Session Actions] Livestream session not found for livestream session ${livestreamSessionId}`);
      return {
         errorMessage:
            "[startPreparingLivestreamSessionAction] No se encontró una sesión de transmisión para el webinar seleccionado",
      };
   }

   await updateLivestreamSession(livestreamSession.id, {
      status: "preparing",
   });

   // const baseOrgPath = await getCurrentOrganizationBasePathFromHeaders()

   revalidatePath(`/live-transmission/[classId]`, "page");

   return {
      successMessage: "Se ha iniciado la preparación de la sesión de transmisión",
   };
}

export async function startLivestreamAction({
   livestreamSessionId,
   zoomSessionId,
   sessionTitle,
}: {
   livestreamSessionId: string;
   zoomSessionId: string;
   sessionTitle: string;
}): Promise<BackendResponse<{ successMessage: string }>> {
   try {
      // const isAuthorized = await checkIfCurrentUserIsAuthorized(["admin", "super_admin"])

      // if (!isAuthorized) {
      //    return {
      //       errorMessage: "No estás autorizado para iniciar la sesión de transmisión"
      //    }
      // }

      const livestreamSession = await getLivestreamSessionById(livestreamSessionId);

      if (!livestreamSession) {
         return {
            success: false,
            errorMessage: "[startLivestreamAction] No se encontró una sesión de transmisión para el webinar seleccionado",
         };
      }

      const livestreamMuxAsset = await getMuxLivestreamRecordByLivestreamSessionId(livestreamSession.id);
      if (!livestreamMuxAsset) {
         return {
            success: false,
            errorMessage: "[startLivestreamAction] No se encontró un asset de transmisión para la sesión de transmisión",
         };
      }

      const { message, success } = await prepareZoomSessionLiveStream(zoomSessionId, MUX_RTMP_URL, livestreamMuxAsset.streamKey);

      if (!success) {
         return {
            success: false,
            errorMessage: message,
         };
      }

      const { success: successStartZoomSessionLiveStream, message: messageStartZoomSessionLiveStream } =
         await startZoomSessionLiveStream(zoomSessionId, sessionTitle);

      if (!successStartZoomSessionLiveStream) {
         return {
            success: false,
            errorMessage: messageStartZoomSessionLiveStream,
         };
      }

      await updateLivestreamSession(livestreamSession.id, {
         status: "streaming",
      });

      return {
         success: true,
         data: {
            successMessage: "Se ha iniciado transmisión en vivo",
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
         errorMessage: "Ocurrió un error al iniciar la transmisión en vivo",
      };
   }
}

export async function resumeLivestreamAction({
   livestreamSessionId,
   zoomSessionId,
   sessionTitle,
}: {
   livestreamSessionId: string;
   zoomSessionId: string;
   sessionTitle: string;
}): Promise<BackendResponse<{ successMessage: string }>> {
   const livestreamSession = await getLivestreamSessionById(livestreamSessionId);
   if (!livestreamSession) {
      return {
         success: false,
         errorMessage: "[resumeLivestreamAction] No se encontró una sesión de transmisión para el webinar seleccionado",
      };
   }

   const livestreamMuxAsset = await getMuxLivestreamRecordByLivestreamSessionId(livestreamSession.id);
   if (!livestreamMuxAsset) {
      return {
         success: false,
         errorMessage: "[resumeLivestreamAction] No se encontró un asset de transmisión para la sesión de transmisión",
      };
   }

   const { message, success } = await prepareZoomSessionLiveStream(zoomSessionId, MUX_RTMP_URL, livestreamMuxAsset.streamKey);

   if (!success) {
      return {
         success: false,
         errorMessage: message,
      };
   }

   const { success: successResumeZoomSessionLiveStream, message: messageResumeZoomSessionLiveStream } =
      await startZoomSessionLiveStream(zoomSessionId, sessionTitle);

   if (!successResumeZoomSessionLiveStream) {
      return {
         success: false,
         errorMessage: messageResumeZoomSessionLiveStream,
      };
   }

   // Updating ONLY the admin status to streaming, the attendant status will be updated by the mux webhook when the live stream is connected
   await updateLivestreamSession(livestreamSession.id, {
      status: "streaming",
   });

   return {
      success: true,
      data: {
         successMessage: "Se ha reanudado la transmisión en vivo",
      },
   };
}

export async function stopLivestreamAction({
   livestreamSessionId,
   zoomSessionId,
}: {
   livestreamSessionId: string;
   zoomSessionId: string;
}): Promise<BackendResponse<{ successMessage: string }>> {
   try {
      // const isAuthorized = await checkIfCurrentUserIsAuthorized(["admin", "super_admin"])

      // if (!isAuthorized) {
      //    return {
      //       errorMessage: "No estás autorizado para detener la sesión de transmisión"
      //    }
      // }

      const livestreamSession = await getLivestreamSessionById(livestreamSessionId);

      if (!livestreamSession) {
         return {
            success: false,
            errorMessage: `[[stopLivestreamAction] No se encontró una sesión de transmisión con id ${livestreamSession}`,
         };
      }

      if (livestreamSession.status !== "streaming") {
         return {
            success: false,
            errorMessage: "La sesión de transmisión no está en estado streaming",
         };
      }

      const { success: successStopZoomSessionLiveStream, message: messageStopZoomSessionLiveStream } =
         await stopZoomSessionLiveStream(zoomSessionId);

      if (!successStopZoomSessionLiveStream) {
         return {
            success: false,
            errorMessage: messageStopZoomSessionLiveStream,
         };
      }

      await updateLivestreamSession(livestreamSession.id, {
         status: "ended",
         attendantStatus: "ended",
      });
      await completeMuxLivestream(livestreamSession.id);

      return {
         success: true,
         data: {
            successMessage: "Se ha detenido la transmisión en vivo",
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
         errorMessage: "Ocurrió un error al detener la transmisión en vivo",
      };
   }
}
