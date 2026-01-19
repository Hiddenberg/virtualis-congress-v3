"use client";

import { isAfter, isBefore } from "@formkit/tempo";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ConferenceFinishedScreen from "@/components/conferenceStageScreens/ConferenceFinishedScreen";
import WaitingToStartScreen from "@/components/conferenceStageScreens/WaitingToStartScreen";
import {
   getSimuliveVariables,
   SimuliveData,
} from "../utils/simulivePlayerUtils";
import PresentationAndVideoSimulivePlayer from "./PresentationAndVideoSimulivePlayer";
import VideoSimulivePlayer from "./VideoSimulivePlayer";

export default function SimuliveStagesWrapper({
   simuliveData,
   conference,
   conferenceRecording,
   isQna,
}: {
   simuliveData: SimuliveData;
   conference: CongressConferenceRecord;
   conferenceRecording: SimpleRecordingRecord | null;
   isQna?: boolean;
}) {
   const [currentStage, setCurrentStage] = useState<
      | "waiting_to_start"
      | "speaker_presentation_recording"
      | "started"
      | "finished"
   >(() => {
      const {
         startDateTimeDate,
         endDateTimeDate,
         serverTimeDate,
         speakerPresentationEndDate,
      } = getSimuliveVariables(simuliveData);

      if (isBefore(serverTimeDate, startDateTimeDate)) {
         return "waiting_to_start";
      }

      if (isAfter(serverTimeDate, endDateTimeDate)) {
         return "finished";
      }

      // If the server time is after the start date and before the speaker presentation end date, show the speaker presentation recording
      if (
         isAfter(serverTimeDate, startDateTimeDate) &&
         isBefore(serverTimeDate, speakerPresentationEndDate)
      ) {
         return "speaker_presentation_recording";
      }

      return "started";
   });

   const recordingId = conferenceRecording?.id;

   const {
      data: presentationBundle,
      isLoading: isLoadingPresentationBundle,
      error: presentationBundleError,
   } = useQuery<{
      presentationRecording: PresentationRecordingRecord | null;
      presentationSlides: PresentationSlideRecord[];
      presentation: PresentationRecord | null;
   }>({
      queryKey: ["recording-presentation-bundle", recordingId],
      queryFn: async () => {
         const response = await fetch(
            `/api/recording/${recordingId}/presentation-bundle`,
         );
         if (!response.ok) {
            throw new Error("No se pudo cargar la presentación");
         }
         return response.json();
      },
      enabled:
         !!recordingId &&
         conferenceRecording?.recordingType === "camera_and_presentation",
      staleTime: 60_000,
   });

   if (!conferenceRecording) {
      return <div>No hay conferencia</div>;
   }

   if (conferenceRecording.status !== "ready") {
      return <div>La conferencia aún no está lista</div>;
   }

   if (!conferenceRecording.muxPlaybackId) {
      return <div>Falta el playbackId de Mux</div>;
   }

   if (currentStage === "waiting_to_start") {
      return (
         <WaitingToStartScreen
            startTime={simuliveData.startDateTime}
            serverTime={simuliveData.serverTime}
            onTimeOut={() => {
               if (simuliveData.speakerPresentationRecording !== null) {
                  setCurrentStage("speaker_presentation_recording");
               } else {
                  setCurrentStage("started");
               }
            }}
         />
      );
   }

   if (currentStage === "finished") {
      return (
         <ConferenceFinishedScreen
            conferenceId={conference.id}
            conferenceTitle={conference.title}
            startTime={simuliveData.startDateTime}
            isQna={isQna}
         />
      );
   }

   if (currentStage === "speaker_presentation_recording") {
      if (!simuliveData.speakerPresentationRecording) {
         return <div>No hay grabación de presentación del ponente</div>;
      }

      if (!simuliveData.speakerPresentationRecording.muxPlaybackId) {
         return (
            <div>
               No hay playbackId de Mux para la grabación de presentación del
               ponente
            </div>
         );
      }

      return (
         <VideoSimulivePlayer
            muxPlaybackId={
               simuliveData.speakerPresentationRecording.muxPlaybackId
            }
            simuliveData={simuliveData}
            onVideoFinished={() => setCurrentStage("started")}
            isSpeakerPresentationRecording={true}
         />
      );
   }

   if (currentStage === "started") {
      if (
         conferenceRecording.recordingType === "camera_and_presentation" &&
         presentationBundle?.presentation?.hasVideo === false
      ) {
         if (isLoadingPresentationBundle) {
            return <div>Cargando presentación…</div>;
         }

         if (presentationBundleError) {
            return <div>No se pudo cargar la presentación</div>;
         }

         const presentationRecording =
            presentationBundle?.presentationRecording || null;
         const presentationSlides =
            presentationBundle?.presentationSlides || [];

         if (!presentationRecording) {
            return <div>No hay g de presentación disponible</div>;
         }

         return (
            <PresentationAndVideoSimulivePlayer
               muxPlaybackId={conferenceRecording.muxPlaybackId}
               presentationRecording={presentationRecording}
               presentationSlides={presentationSlides}
               simuliveData={simuliveData}
               onVideoFinished={() => {
                  setCurrentStage("finished");
               }}
            />
         );
      }

      return (
         <VideoSimulivePlayer
            muxPlaybackId={conferenceRecording.muxPlaybackId}
            simuliveData={simuliveData}
            onVideoFinished={() => {
               setCurrentStage("finished");
            }}
         />
      );
   }
}
