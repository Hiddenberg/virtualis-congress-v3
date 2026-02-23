"use client";

import { useState } from "react";
import DynamicZoomCallInterface from "@/features/livestreams/components/DynamicZoomCallInterface";
import { useZoomSession } from "@/features/livestreams/contexts/ZoomSessionContext";
import PresentationRecorder from "@/features/pptPresentations/components/PresentationRecorder";
import { PresentationDrawingProvider } from "@/features/pptPresentations/contexts/PresentationDrawingContext";
import { PresentationRecorderProvider } from "@/features/pptPresentations/contexts/PresentationRecorderContext";
import type { SimpleRecordingRecord } from "../../types/recordingsTypes";
import DeleteRecordingPresentationWPopupButton from "../DeleteRecordingPresentationWPopupButton";
import RecordingLivestreamControlButtons from "../RecordingLivestreamControlButtons";

interface PresentationAndCameraRecorderProps {
   recordingId: SimpleRecordingRecord["id"];
   recordingPresentation: PresentationRecord | null;
   recordingPresentationSlides: PresentationSlideRecord[];
   sessionTitle: string;
   presentationHasVideo: boolean | null;
   username: string;
}

export default function PresentationAndCameraRecorder({
   recordingId,
   recordingPresentation,
   recordingPresentationSlides,
   sessionTitle,
   presentationHasVideo,
   username,
}: PresentationAndCameraRecorderProps) {
   const [zoomIsLoading, setZoomIsLoading] = useState(true);
   const { sessionId } = useZoomSession();
   if (!recordingPresentation || recordingPresentationSlides.length === 0) {
      return (
         <div>
            <p>No se encontró la diapositiva</p>
         </div>
      );
   }

   return (
      <PresentationRecorderProvider presentationId={recordingPresentation.id}>
         <PresentationDrawingProvider presentationId={recordingPresentation.id}>
            <div className="bg-gray-100! min-h-screen!">
               <div className="mx-auto! p-4! container!">
                  <div className="space-y-4! bg-white! shadow-lg! mb-6! p-6! rounded-2xl!">
                     <div className="justify-between! items-center! flex!">
                        <div>
                           <h2 className="font-bold! text-2xl! text-gray-900!">Grabando: {sessionTitle}</h2>
                        </div>

                        <DeleteRecordingPresentationWPopupButton recordingId={recordingId} />

                        <div className="items-center! gap-2! text-sm! flex!">
                           <div
                              className={`w-3! h-3! rounded-full! ${presentationHasVideo ? "bg-orange-400!" : "bg-green-400!"}`}
                           />
                           <span className="text-gray-600!">
                              {presentationHasVideo ? "Diapositiva con videos" : "Diapositiva estática"}
                           </span>
                        </div>
                     </div>

                     <div className="top-0! z-10! justify-center! mt-6! w-max! sticky! flex!">
                        {!zoomIsLoading && <RecordingLivestreamControlButtons sessionTitle={sessionTitle} />}
                     </div>

                     <div className="space-y-4!">
                        <DynamicZoomCallInterface
                           className="mx-auto! rounded-2xl! max-w-80!"
                           initialUsername={username}
                           setIsLoading={setZoomIsLoading}
                           isHostByDefault={true}
                        />

                        {sessionId && (
                           <div>
                              <PresentationRecorder presentationSlides={recordingPresentationSlides} />
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </PresentationDrawingProvider>
      </PresentationRecorderProvider>
   );
}
