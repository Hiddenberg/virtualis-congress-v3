"use client";

import { PlayIcon, StopCircleIcon, VideoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { startTransition, useCallback, useContext, useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { useRealtimeLivestreamStatusContext } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider";
import { useZoomSession } from "@/features/livestreams/contexts/ZoomSessionContext";
import {
   resumeLivestreamAction,
   startLivestreamAction,
   stopLivestreamAction,
} from "@/features/livestreams/serverActions/livestreamSessionActions";
import { PresentationDrawingContext } from "@/features/pptPresentations/contexts/PresentationDrawingContext";
import { PresentationRecorderContext } from "@/features/pptPresentations/contexts/PresentationRecorderContext";

function StartRecordingButton({
   sessionTitle,
   handleBeforeUnload,
}: {
   sessionTitle: string;
   handleBeforeUnload: (e: BeforeUnloadEvent) => string;
}) {
   const { livestreamSession } = useRealtimeLivestreamStatusContext();
   const { sessionId } = useZoomSession();
   const [starting, startTransition] = useTransition();

   const presentationRecorder = useContext(PresentationRecorderContext);

   const handleStartRecording = () => {
      startTransition(async () => {
         if (!sessionId || typeof sessionId !== "string") {
            toast.error("Error: No se encontró la sesión de grabación");
            return;
         }

         const response = await startLivestreamAction({
            livestreamSessionId: livestreamSession.id,
            zoomSessionId: sessionId,
            sessionTitle: sessionTitle,
         });

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         // Start or resume presentation recording if persisted data exists
         if (presentationRecorder) {
            if (presentationRecorder.hasPersistedData) {
               presentationRecorder.resumeRecording();
            } else {
               presentationRecorder.startRecording();
            }
         }

         window.addEventListener("beforeunload", handleBeforeUnload);

         toast.success("¡Se ha iniciado la grabación!");
      });
   };

   return (
      <Button
         variant="none"
         className="!flex !justify-center !items-center !gap-3 !bg-gradient-to-r !from-green-500 hover:!from-green-600 !to-green-600 hover:!to-green-700 !shadow-lg hover:!shadow-xl !px-6 !py-3 !border-0 !rounded-xl !min-w-[160px] !font-semibold !text-white hover:!scale-105 active:!scale-95 !transition-all !duration-200 !transform"
         loading={starting}
         onClick={handleStartRecording}
      >
         <VideoIcon className="!size-5" />
         <span className="!font-medium !text-sm">Iniciar grabación</span>
      </Button>
   );
}

function StopRecordingButton({ handleBeforeUnload }: { handleBeforeUnload: (e: BeforeUnloadEvent) => string }) {
   const { livestreamSession } = useRealtimeLivestreamStatusContext();
   const { sessionId } = useZoomSession();
   const [stopping, startTransition] = useTransition();
   const { recordingId } = useParams();

   const presentationRecorder = useContext(PresentationRecorderContext);
   const drawingContext = useContext(PresentationDrawingContext);

   const handleStopRecording = useCallback(() => {
      if (!sessionId || typeof sessionId !== "string") {
         toast.error("Error: No se encontró la sesión de grabación");
         return;
      }

      if (!livestreamSession) {
         toast.error("Error: No se encontró la sesión de transmisión");
         return;
      }

      startTransition(async () => {
         const stopResponse = await stopLivestreamAction({
            livestreamSessionId: livestreamSession.id,
            zoomSessionId: sessionId,
         });

         if (!stopResponse.success) {
            toast.error(stopResponse.errorMessage);
            return;
         }

         // Stop recording presentation
         if (presentationRecorder) {
            presentationRecorder.stopRecording();
            await presentationRecorder.savePresentationRecording();
         }
         if (drawingContext) {
            await drawingContext.saveDrawingEvents();
         }

         window.removeEventListener("beforeunload", handleBeforeUnload);

         toast.promise(new Promise((resolve) => setTimeout(resolve, 15000)), {
            loading: "Procesando grabación, por favor no cierres la página aún 📽️",
            success: () => {
               window.location.href = `/recordings/record/${recordingId}/review`;
               return "Grabación procesada con éxito";
            },
         });
      });
   }, [drawingContext, handleBeforeUnload, livestreamSession, presentationRecorder, recordingId, sessionId]);

   return (
      <Button
         variant="none"
         className="!flex !justify-center !items-center !gap-3 !bg-gradient-to-r !from-red-500 hover:!from-red-600 !to-red-600 hover:!to-red-700 !shadow-lg hover:!shadow-xl !px-6 !py-3 !border-0 !rounded-xl !min-w-[160px] !font-semibold !text-white hover:!scale-105 active:!scale-95 !transition-all !duration-200 !transform"
         loading={stopping}
         onClick={handleStopRecording}
      >
         <StopCircleIcon className="!size-5" />
         <span className="!font-medium !text-sm">Detener grabación</span>
      </Button>
   );
}

function ResumeRecordingButton({
   sessionTitle,
   handleBeforeUnload,
}: {
   sessionTitle: string;
   handleBeforeUnload: (e: BeforeUnloadEvent) => string;
}) {
   const { livestreamSession } = useRealtimeLivestreamStatusContext();
   const { sessionId } = useZoomSession();
   const presentationRecorder = useContext(PresentationRecorderContext);

   const handleResumeRecording = () => {
      if (!sessionId || typeof sessionId !== "string") {
         toast.error("Error: No se encontró la sesión de grabación");
         return;
      }
      startTransition(async () => {
         const resumeResponse = await resumeLivestreamAction({
            livestreamSessionId: livestreamSession.id,
            zoomSessionId: sessionId,
            sessionTitle: sessionTitle,
         });

         if (!resumeResponse.success) {
            toast.error(resumeResponse.errorMessage);
            return;
         }

         // Resume local presentation timeline if available
         if (presentationRecorder) {
            presentationRecorder.resumeRecording();
         }

         window.addEventListener("beforeunload", handleBeforeUnload);
         toast.success("Se ha reanudado la grabación");
      });
   };
   return (
      <Button
         variant="none"
         className="!flex !justify-center !items-center !gap-3 !bg-gradient-to-r !from-green-500 hover:!from-green-600 !to-green-600 hover:!to-green-700 !shadow-lg hover:!shadow-xl !px-6 !py-3 !border-0 !rounded-xl !min-w-[160px] !font-semibold !text-white hover:!scale-105 active:!scale-95 !transition-all !duration-200 !transform"
         onClick={handleResumeRecording}
      >
         <PlayIcon className="!size-5" />
         <span className="!font-medium !text-sm">Reanudar grabación</span>
      </Button>
   );
}

function RecordingButtonSelector({ sessionTitle }: { sessionTitle: string }) {
   const { livestreamStatus } = useRealtimeLivestreamStatusContext();

   const handleBeforeUnloadRef = useRef((e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "No puedes cerrar la página mientras estás grabando";
      return "No puedes cerrar la página mientras estás grabando";
   });

   if (livestreamStatus === "preparing" || livestreamStatus === "scheduled") {
      return (
         <div className="!flex !flex-col !items-center !gap-2">
            <div className="!font-medium !text-gray-600 !text-xs !uppercase !tracking-wide">Listo para comenzar</div>
            <StartRecordingButton sessionTitle={sessionTitle} handleBeforeUnload={handleBeforeUnloadRef.current} />
         </div>
      );
   }

   if (livestreamStatus === "streaming") {
      return (
         <div>
            <div className="!flex !flex-col !items-center !gap-2">
               <div className="!flex !items-center !gap-2 !font-medium !text-red-600 !text-xs !uppercase !tracking-wide">
                  <div className="!bg-red-500 !rounded-full !w-2 !h-2 !animate-pulse" />
                  Grabando...
               </div>
               <StopRecordingButton handleBeforeUnload={handleBeforeUnloadRef.current} />
            </div>
         </div>
      );
   }

   if (livestreamStatus === "paused") {
      return (
         <div className="!flex !flex-col !items-center !gap-2">
            <div className="!font-medium !text-gray-600 !text-xs !uppercase !tracking-wide">Grabación pausada</div>
            <ResumeRecordingButton handleBeforeUnload={handleBeforeUnloadRef.current} sessionTitle={sessionTitle} />
         </div>
      );
   }

   if (livestreamStatus === "ended") {
      return (
         <div className="!flex !flex-col !items-center !gap-2">
            <div className="!font-medium !text-gray-600 !text-xs !uppercase !tracking-wide">Grabación terminada</div>
         </div>
      );
   }

   // If the livestream status is not "preparing", "scheduled", "streaming", or "paused", return the following:
   return (
      <div className="!flex !flex-col !items-center !gap-2 !py-4">
         <div className="!font-medium !text-gray-500 !text-xs !uppercase !tracking-wide">
            Estado: Grabación terminada, ya puedes cerrar la página
         </div>
      </div>
   );
}

export default function RecordingLivestreamControlButtons({ sessionTitle }: { sessionTitle: string }) {
   const { sessionId } = useZoomSession();

   if (!sessionId) {
      return (
         <div>
            <p className="!font-medium !text-red-600 !text-xs !uppercase !tracking-wide">
               Ocurrió un error al obtener el estado de la grabación
            </p>
            <Button
               variant="primary"
               onClick={() => {
                  window.location.reload();
               }}
            >
               recargar la página
            </Button>
         </div>
      );
   }

   return (
      <div className="!flex !justify-center !items-center !gap-4 !bg-white/90 !shadow-lg !backdrop-blur-sm !p-4 !border !border-gray-200/50 !rounded-2xl">
         {/* Status indicator when no action is available */}
         <RecordingButtonSelector sessionTitle={sessionTitle} />
      </div>
   );
}
