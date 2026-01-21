"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useMemo, useState } from "react";
import { getSimuliveVariables, type SimuliveData } from "../utils/simulivePlayerUtils";
import UnmuteOverlay from "./UnmuteOverlay";

export default function VideoSimulivePlayer({
   muxPlaybackId,
   simuliveData,
   onVideoFinished,
   isSpeakerPresentationRecording = false,
}: {
   muxPlaybackId: string;
   simuliveData: SimuliveData;
   onVideoFinished?: () => void;
   isSpeakerPresentationRecording?: boolean;
}) {
   const [isMuted, setIsMuted] = useState(true);

   useEffect(() => {
      const playerEl = document.querySelector("mux-player") as HTMLMediaElement | undefined;
      if (!playerEl) return;

      const onEnded = () => {
         onVideoFinished?.();
      };

      playerEl.addEventListener("ended", onEnded);
      return () => {
         playerEl.removeEventListener("ended", onEnded);
      };
   }, [onVideoFinished]);

   const { timeVideoShouldStart, timeSpeakerPresentationShouldStart } = useMemo(
      () => getSimuliveVariables(simuliveData),
      [simuliveData],
   );

   // if (isAfter(serverTimeDate, endDateTimeDate)) {
   //    return <div>La conferencia ha terminado</div>
   // }

   // if (isBefore(serverTimeDate, startDateTimeDate)) {
   //    return <div>La conferencia aún no ha comenzado</div>
   // }

   return (
      <div className="relative bg-black rounded-lg w-auto max-h-[80dvh] aspect-video overflow-hidden">
         <UnmuteOverlay isMuted={isMuted} onClick={() => setIsMuted(false)} />
         <MuxPlayer
            playbackId={muxPlaybackId}
            startTime={isSpeakerPresentationRecording ? timeSpeakerPresentationShouldStart : timeVideoShouldStart}
            muted={isMuted}
            className="w-full h-full aspect-video pointer-events-none"
            style={{
               "--controls": "none",
            }}
            autoPlay="any"
         />
      </div>
   );
}
