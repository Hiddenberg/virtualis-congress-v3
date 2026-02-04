"use client";

import { PauseIcon, PlayIcon, RadioTowerIcon, SignalIcon, StopCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { useRealtimeLivestreamStatusContext } from "../contexts/RealtimeLivestreamStatusProvider";
import { useZoomSession } from "../contexts/ZoomSessionContext";
import { resumeLivestreamAction, startLivestreamAction, stopLivestreamAction } from "../serverActions/livestreamSessionActions";

export function StartLiveStreamButton({
   zoomSessionId,
   livestreamSessionId,
   sessionTitle,
}: {
   zoomSessionId: string | null;
   livestreamSessionId: string | null;
   sessionTitle: string | null;
}) {
   const [isLoading, startTransition] = useTransition();

   if (!zoomSessionId) {
      return <p>No se encontró la sesión de Zoom</p>;
   }

   const handleStartLiveStream = () => {
      startTransition(async () => {
         const startResponse = await startLivestreamAction({
            livestreamSessionId: livestreamSessionId as string,
            zoomSessionId,
            sessionTitle: sessionTitle as string,
         });

         if (!startResponse.success) {
            toast.error(startResponse.errorMessage);
            return;
         }

         toast.success(startResponse.data.successMessage);
      });
   };

   return (
      <Button
         className={`p-2! border! border-green-600! bg-green-600! hover:bg-green-700! text-white! font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 ${isLoading ? "opacity-50 animate-pulse cursor-not-allowed" : ""}`}
         disabled={!zoomSessionId || isLoading}
         onClick={handleStartLiveStream}
      >
         <PlayIcon className="w-5 h-5" />
         {isLoading ? "Iniciando..." : "Iniciar Transmisión"}
      </Button>
   );
}

export function ResumeLiveStreamButton({
   livestreamSessionId,
   zoomSessionId,
   sessionTitle,
}: {
   livestreamSessionId: string;
   zoomSessionId: string;
   sessionTitle: string;
}) {
   const [isLoading, startTransition] = useTransition();

   const handleResumeLiveStream = () => {
      startTransition(async () => {
         const resumeResponse = await resumeLivestreamAction({
            livestreamSessionId,
            zoomSessionId,
            sessionTitle,
         });

         if (resumeResponse.success === true) {
            toast.success(resumeResponse.data?.successMessage);
         } else {
            toast.error(resumeResponse.errorMessage);
         }
      });
   };

   return (
      <Button
         variant="none"
         className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-3 ${isLoading ? "opacity-50 animate-pulse cursor-not-allowed" : ""}`}
         disabled={isLoading}
         onClick={handleResumeLiveStream}
      >
         <PlayIcon className="w-5 h-5" />
         {isLoading ? "Reanudando..." : "Reanudar Transmisión"}
      </Button>
   );
}

export function StopLiveStreamButton({
   zoomSessionId,
   livestreamSessionId,
}: {
   zoomSessionId: string | null;
   livestreamSessionId: string;
}) {
   const [isLoading, startTransition] = useTransition();

   if (!zoomSessionId) {
      return <p>No se encontró la sesión de Zoom</p>;
   }

   const handleStopLiveStream = () => {
      const confirmation = confirm("¿Estás seguro de querer detener la transmisión?, esta acción es irreversible");

      if (!confirmation) {
         return;
      }

      toast.loading("Deteniendo transmisión, esto puede tardar unos segundos...");
      startTransition(async () => {
         await new Promise((resolve) => setTimeout(resolve, 10000));

         const stopResponse = await stopLivestreamAction({
            livestreamSessionId,
            zoomSessionId,
         });

         toast.dismiss();

         if (!stopResponse.success) {
            toast.error(stopResponse.errorMessage);
            return;
         }

         toast.success(stopResponse.data.successMessage);
      });
   };

   return (
      <Button
         variant="destructive"
         className="justify-center! items-center! gap-3! bg-linear-to-r! from-red-500! hover:from-red-600! to-red-600! hover:to-red-700! shadow-lg! hover:shadow-xl! px-6! py-3! border-0! rounded-xl! min-w-[160px]! font-semibold! text-white! hover:scale-105! active:scale-95! transition-all! duration-200! flex! transform!"
         loading={isLoading}
         disabled={!zoomSessionId || isLoading}
         onClick={handleStopLiveStream}
      >
         <StopCircle className="w-5 h-5" />
         {isLoading ? "Deteniendo..." : "Detener Transmisión"}
      </Button>
   );
}

export function LivestreamControlButtons({
   livestreamSessionId,
   sessionTitle,
}: {
   livestreamSessionId: string;
   sessionTitle: string;
}) {
   const { sessionId: zoomSessionId } = useZoomSession();

   const { livestreamStatus } = useRealtimeLivestreamStatusContext();
   const searchParams = useSearchParams();
   const isHost = searchParams.get("ishost") === "true" || searchParams.get("isHost") === "true";

   const statusMap: Record<LivestreamSessionStatus, string> = {
      ended: "Transmisión finalizada",
      preparing: "Preparando transmisión",
      scheduled: "Transmisión programada",
      streaming: "Transmitiendo en vivo",
      paused: "Transmisión pausada",
   };

   const statusColorMap: Record<LivestreamSessionStatus, string> = {
      ended: "text-red-600",
      preparing: "text-amber-600",
      scheduled: "text-stone-600",
      streaming: "text-green-600",
      paused: "text-orange-600",
   };

   const statusIconMap: Record<LivestreamSessionStatus, React.ReactNode> = {
      ended: <StopCircle className="w-5 h-5" />,
      preparing: <SignalIcon className="w-5 h-5" />,
      scheduled: <PauseIcon className="w-5 h-5" />,
      streaming: <RadioTowerIcon className="w-5 h-5 animate-pulse" />,
      paused: <PauseIcon className="w-5 h-5" />,
   };

   if (!zoomSessionId) {
      return <p>No se encontró la sesión de Zoom</p>;
   }

   return (
      <div className="flex justify-between items-center gap-4">
         {/* Control Buttons */}
         <div className="flex items-center gap-4">
            {isHost ? (
               <div>
                  {(livestreamStatus === "preparing" || livestreamStatus === "scheduled" || livestreamStatus === "ended") && (
                     <StartLiveStreamButton
                        zoomSessionId={zoomSessionId}
                        livestreamSessionId={livestreamSessionId}
                        sessionTitle={sessionTitle}
                     />
                  )}

                  {livestreamStatus === "paused" && (
                     <ResumeLiveStreamButton
                        livestreamSessionId={livestreamSessionId}
                        zoomSessionId={zoomSessionId}
                        sessionTitle={sessionTitle}
                     />
                  )}

                  {livestreamStatus === "streaming" && (
                     <StopLiveStreamButton zoomSessionId={zoomSessionId} livestreamSessionId={livestreamSessionId} />
                  )}
               </div>
            ) : (
               <div className="text-stone-500 text-sm">Solo el administrador puede controlar la transmisión</div>
            )}
         </div>

         {/* Status Display */}
         <div className="flex items-center self-center gap-3">
            <div className="bg-stone-100 p-2 rounded-lg">
               <div className={statusColorMap[livestreamStatus]}>{statusIconMap[livestreamStatus]}</div>
            </div>
            <div>
               <p className={`font-semibold ${statusColorMap[livestreamStatus]}`}>{statusMap[livestreamStatus]}</p>
               <p className="text-stone-500 text-sm">Estado de la transmisión</p>
            </div>
         </div>

         <div className="bg-stone-200 w-40" />
      </div>
   );
}
