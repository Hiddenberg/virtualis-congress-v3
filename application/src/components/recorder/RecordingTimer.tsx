"use client";

import { Timer } from "lucide-react";
import { useContext, useEffect } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";
import { formatVideoTime } from "@/utils/recorderUtils";
import Countdown from "./Countdown";

interface RecordingTimerProps {
   isPaused?: boolean;
}

function RecordingTimer({ isPaused = false }: RecordingTimerProps) {
   const { secondsRecorded, setSecondsRecorded } = useContext(
      ScreenRecorderContext,
   );

   useEffect(() => {
      let interval: NodeJS.Timeout;

      if (!isPaused) {
         interval = setInterval(() => {
            setSecondsRecorded((prev) => prev + 1);
         }, 1000);
      }

      return () => clearInterval(interval);
   }, [isPaused, setSecondsRecorded]);

   return (
      <div className="flex flex-col items-center gap-2 bg-black my-2 p-2 px-6 rounded-3xl font-mono text-white text-5xl">
         <Timer className="size-8 text-white-500 animate-pulse" />
         <span>{formatVideoTime(secondsRecorded)}</span>
      </div>
   );
}

export function RecordingTimerBar() {
   const { recorderState, isPaused, isStopped, isInitialTestCompleted } =
      useContext(ScreenRecorderContext);

   if (recorderState === "settingUp" || recorderState === "readyToRecord") {
      return null;
   }

   if (!isInitialTestCompleted) {
      return (
         <div className="flex flex-col items-center gap-2">
            <p className="mt-4 font-semibold text-center">
               La prueba terminará en:
            </p>
            <Countdown duration={10000} />
            <div className="w-0 h-0 overflow-hidden">
               <RecordingTimer isPaused={isPaused || isStopped} />
            </div>
         </div>
      );
   }

   return (
      <div>
         <div
            className={`flex justify-center items-center my-2 w-full ${isStopped ? "animate-pulse" : ""}`}
         >
            <RecordingTimer isPaused={isPaused || isStopped} />
         </div>
      </div>
   );
}
