"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { isAfter, isBefore } from "validator";
import AboutToStartLiveScreen from "@/components/conferenceStageScreens/AboutToStartLiveScreen";
import ConferenceFinishedScreen from "@/components/conferenceStageScreens/ConferenceFinishedScreen";
import PausedLivestreamScreen from "@/components/conferenceStageScreens/PausedLivestreamScreen";
import WaitingToStartScreen from "@/components/conferenceStageScreens/WaitingToStartScreen";
import { useRealtimeLivestreamStatusContext } from "../../contexts/RealtimeLivestreamStatusProvider";
import LivestreamVideoAndPresentationPlayer from "./LivestreamVideoAndPresentationPlayer";
import LivestreamVideoPlayer from "./LivestreamVideoPlayer";

type LivestreamStage =
   | "waiting_to_start"
   | "started"
   | "finished"
   | "paused"
   | "preparing_livestream";

export default function LivestreamStagesWrapper({
   conference,
   conferencePresentation,
   serverTime,
   isQna,
}: {
   conference: CongressConferenceRecord;
   conferencePresentation: PresentationRecord | null;
   serverTime: string;
   isQna?: boolean;
}) {
   const { attendantStatus, livestreamSession } =
      useRealtimeLivestreamStatusContext();
   const { data: livestreamMuxAsset, isLoading: livestreamMuxAssetLoading } =
      useQuery<{
         data: LivestreamMuxAssetRecord | null;
      }>({
         queryKey: ["livestream-mux-asset"],
         queryFn: () =>
            fetch(
               `/api/livestreams/${livestreamSession.id}/livestreamMuxAsset`,
            ).then((res) => res.json()),
      });
   const selectStatus = useCallback((): LivestreamStage => {
      // Check the livestream status first
      if (attendantStatus === "scheduled") {
         return "preparing_livestream";
      }

      if (attendantStatus === "streaming") {
         return "started";
      }
      if (attendantStatus === "paused") {
         return "paused";
      }
      if (attendantStatus === "ended") {
         return "finished";
      }

      // Check if the conference has started or ended
      if (isBefore(serverTime, conference.startTime)) {
         return "waiting_to_start";
      }

      if (isAfter(serverTime, conference.endTime)) {
         return "finished";
      }

      return "preparing_livestream";
   }, [attendantStatus, serverTime, conference.startTime, conference.endTime]);

   const [currentStage, setCurrentStage] = useState<LivestreamStage>(() => {
      return selectStatus();
   });

   console.log("currentStage", currentStage);

   useEffect(() => {
      setCurrentStage(selectStatus());
   }, [
      attendantStatus,
      serverTime,
      conference.startTime,
      conference.endTime,
      selectStatus,
   ]);

   if (livestreamMuxAssetLoading) {
      return <div>Loading...</div>;
   }

   if (!livestreamMuxAsset || !livestreamMuxAsset.data) {
      return <div>No livestream mux asset</div>;
   }

   if (currentStage === "paused") {
      return <PausedLivestreamScreen />;
   }

   if (currentStage === "preparing_livestream") {
      return (
         <AboutToStartLiveScreen
            conferenceTitle={conference.title}
            startTime={conference.startTime}
         />
      );
   }

   if (currentStage === "waiting_to_start") {
      return (
         <WaitingToStartScreen
            startTime={conference.startTime}
            serverTime={serverTime}
            onTimeOut={() => setCurrentStage("preparing_livestream")}
         />
      );
   }

   if (currentStage === "finished") {
      return (
         <ConferenceFinishedScreen
            conferenceId={conference.id}
            conferenceTitle={conference.title}
            startTime={conference.startTime}
            isQna={isQna}
         />
      );
   }

   if (currentStage === "started") {
      if (
         conferencePresentation &&
         !conferencePresentation.hasVideo &&
         !isQna
      ) {
         return (
            <LivestreamVideoAndPresentationPlayer
               livestreamPlaybackId={
                  livestreamMuxAsset.data.livestreamPlaybackId
               }
               presentationId={conferencePresentation.id}
            />
         );
      }

      return (
         <LivestreamVideoPlayer
            livestreamPlaybackId={livestreamMuxAsset.data.livestreamPlaybackId}
         />
      );
   }
}
