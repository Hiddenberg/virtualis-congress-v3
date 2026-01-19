"use client";

import { RadioTowerIcon, Video, XIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
   cancelQnALivestreamSessionAction,
   moveToZoomAction,
   startQnALivestreamSessionAction,
   stopQnALivestreamSessionAction,
} from "@/actions/livestreamActions";
import { Button } from "../global/Buttons";
import PopUp from "../global/PopUp";

interface LiveControlButtonProps {
   sessionId: string | null;
}

export function StartLiveStreamButton({
   zoomSessionId,
   setIsSessionActive,
}: {
   zoomSessionId: string | null;
   setIsSessionActive: (isSessionActive: boolean) => void;
}) {
   const [isLoading, startTransition] = useTransition();

   const { conferenceId } = useParams();

   if (!conferenceId) {
      return <p>No se encontró la conferencia</p>;
   }

   if (!zoomSessionId) {
      return <p>No se encontró la sesión de Zoom</p>;
   }

   const handleStartLiveStream = () => {
      startTransition(async () => {
         const { success, message, error } =
            await startQnALivestreamSessionAction(
               conferenceId as string,
               zoomSessionId,
            );

         if (!success) {
            alert(error);
         }

         if (success) {
            alert(message);
            setIsSessionActive(true);
         }
      });
   };

   return (
      <Button
         variant="green"
         className={`flex items-center gap-2 ${isLoading ? "animate-pulse" : ""}`}
         disabled={!zoomSessionId || isLoading}
         onClick={handleStartLiveStream}
      >
         <RadioTowerIcon className="size-4" />{" "}
         {isLoading ? "Iniciando..." : "Iniciar transmisión"}
      </Button>
   );
}

export function StopLiveStreamButton({
   zoomSessionId,
   setIsSessionActive,
}: {
   zoomSessionId: string | null;
   setIsSessionActive: (isSessionActive: boolean) => void;
}) {
   const [isLoading, startTransition] = useTransition();

   const { conferenceId } = useParams();

   if (!conferenceId) {
      return <p>No se encontró la conferencia</p>;
   }

   if (!zoomSessionId) {
      return <p>No se encontró la sesión de Zoom</p>;
   }

   const handleStopLiveStream = () => {
      const confirmation = confirm(
         "¿Estás seguro de querer finalizar la transmisión de preguntas y respuestas?, esta acción no se puede deshacer.",
      );

      if (!confirmation) {
         return;
      }

      startTransition(async () => {
         const { success, message, error } =
            await stopQnALivestreamSessionAction(
               conferenceId as string,
               zoomSessionId,
            );

         if (!success) {
            alert(error);
         }

         if (success) {
            alert(message);
            setIsSessionActive(false);
         }
      });
   };

   console.log(zoomSessionId);
   return (
      <Button
         variant="destructive"
         className={`flex items-center gap-2 ${isLoading ? "animate-pulse" : ""}`}
         disabled={!zoomSessionId || isLoading}
         onClick={handleStopLiveStream}
      >
         <RadioTowerIcon className="size-4" />{" "}
         {isLoading ? "Finalizando..." : "Finalizar transmisión"}
      </Button>
   );
}

export function MoveToZoomButton() {
   const [isLoading, startTransition] = useTransition();
   const [settingZoomLink, setSettingZoomLink] = useState(false);
   const [zoomLink, setZoomLink] = useState("");
   const { conferenceId } = useParams();

   if (!conferenceId) {
      return null;
   }

   const handleStartMovingToZoom = () => {
      const confirmation = confirm(
         "¿Estás seguro de querer mover la transmisión a Zoom?, esta acción no se puede deshacer.",
      );

      if (!confirmation) {
         return;
      }

      setSettingZoomLink(true);
   };

   const handleFinishMovingToZoom = () => {
      startTransition(async () => {
         const { success, message, error } = await moveToZoomAction(
            conferenceId as string,
            zoomLink,
         );

         if (!success) {
            alert(error);
         }

         if (success) {
            alert(message);
         }

         setSettingZoomLink(false);
      });
   };

   return (
      <div>
         <Button
            variant="primary"
            className={`flex items-center gap-2 ${isLoading ? "animate-pulse" : ""}`}
            disabled={isLoading}
            onClick={handleStartMovingToZoom}
         >
            <Video className="size-4" />{" "}
            {isLoading ? "Moviendo a Zoom..." : "Mover a Zoom"}
         </Button>

         {settingZoomLink && (
            <PopUp onClose={() => setSettingZoomLink(false)}>
               <div className="flex flex-col items-center gap-2">
                  <h2>Configurar enlace de Zoom</h2>
                  <input
                     className="p-2 border border-gray-300 rounded-md"
                     type="text"
                     placeholder="Enlace de Zoom"
                     value={zoomLink}
                     onChange={(e) => setZoomLink(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleFinishMovingToZoom}>
                     Mover sesión a este enlace
                  </Button>
               </div>
            </PopUp>
         )}
      </div>
   );
}

function CancelQnALivestreamSessionButton() {
   const [isLoading, startTransition] = useTransition();
   const { conferenceId } = useParams();

   if (!conferenceId) {
      return null;
   }

   const handleCancelQnALivestreamSession = () => {
      const confirmation = confirm(
         "¿Estás seguro de querer cancelar la transmisión de preguntas y respuestas?, esta acción no se puede deshacer.",
      );

      if (!confirmation) {
         return;
      }

      startTransition(async () => {
         const { success, message, error } =
            await cancelQnALivestreamSessionAction(conferenceId as string);

         if (!success) {
            alert(error);
         }

         alert(message);
      });
   };

   return (
      <Button
         variant="destructive"
         className={`flex items-center gap-2 ${isLoading ? "animate-pulse" : ""}`}
         disabled={isLoading}
         onClick={handleCancelQnALivestreamSession}
      >
         <XIcon className="size-4" />{" "}
         {isLoading ? "Cancelando..." : "Cancelar Sesión"}
      </Button>
   );
}

export default function LiveControlButtons({
   sessionId,
}: LiveControlButtonProps) {
   const [isSessionActive, setIsSessionActive] = useState(false);

   const isHost = useSearchParams().get("ishost") === "true";

   if (!isHost) {
      return null;
   }

   return (
      <div className="flex flex-col justify-center items-center gap-2 py-4">
         {isSessionActive ? (
            <StopLiveStreamButton
               zoomSessionId={sessionId}
               setIsSessionActive={setIsSessionActive}
            />
         ) : (
            <StartLiveStreamButton
               zoomSessionId={sessionId}
               setIsSessionActive={setIsSessionActive}
            />
         )}

         <div className="flex gap-2 mt-4">
            <MoveToZoomButton />
            <CancelQnALivestreamSessionButton />
         </div>
      </div>
   );
}
