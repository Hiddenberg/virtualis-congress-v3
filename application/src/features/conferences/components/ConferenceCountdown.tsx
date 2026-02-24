"use client";

import { useEffect, useMemo, useState } from "react";
import { useConferenceCountdownContext } from "@/features/conferences/contexts/ConferenceCountdownContext";
import type { CongressConferenceRecord } from "../types/conferenceTypes";

export default function ConferenceCountdown({ conference }: { conference: CongressConferenceRecord }) {
   const startDate = useMemo(() => new Date(conference.startTime), [conference.startTime]);
   const endDate = useMemo(() => new Date(conference.endTime), [conference.endTime]);

   const startMs = useMemo(() => startDate.getTime(), [startDate]);
   const endMs = useMemo(() => endDate.getTime(), [endDate]);
   const durationMs = useMemo(() => Math.max(0, endMs - startMs), [endMs, startMs]);

   const [remainingMs, setRemainingMs] = useState<number>(() => durationMs);
   const countdownContext = useConferenceCountdownContext();

   useEffect(() => {
      // Reset to full duration whenever the conference times change
      setRemainingMs(durationMs);
      if (durationMs <= 0) return;

      const intervalId = window.setInterval(() => {
         setRemainingMs((prev) => {
            const next = Math.max(0, prev - 1000);
            // if (next <= 0) {
            //    window.clearInterval(intervalId);
            // }
            return next;
         });
      }, 1000);

      return () => window.clearInterval(intervalId);
   }, [durationMs]);

   const formatRemaining = (ms: number) => {
      const totalSeconds = Math.ceil(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n: number) => String(n).padStart(2, "0");
      if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      return `${pad(minutes)}:${pad(seconds)}`;
   };

   const isFinished = remainingMs <= 0;
   const fiveMinutesMs = 5 * 60 * 1000;
   const oneMinuteMs = 60 * 1000;
   const isEndingSoon = remainingMs > 0 && remainingMs <= fiveMinutesMs;

   const handleAdjustMinutes = (deltaMs: number) => {
      setRemainingMs((prev) => Math.max(0, prev + deltaMs));
   };

   useEffect(() => {
      if (!countdownContext) return;
      countdownContext.setIsFinished(isFinished);
   }, [countdownContext, isFinished]);

   return (
      <div
         className={`group relative p-4 py-2 rounded-xl w-full text-center transition-all duration-300 ${
            isFinished
               ? "border-2 bg-red-500 border-rose-300 shadow-lg"
               : isEndingSoon
                 ? "bg-orange-50 border-2 border-orange-200 shadow-md"
                 : "bg-white shadow-sm border border-blue-100"
         }`}
      >
         <div className="top-1/2 left-2 absolute flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition -translate-y-1/2 duration-200 pointer-events-none group-hover:pointer-events-auto">
            <button
               type="button"
               onClick={() => handleAdjustMinutes(-fiveMinutesMs)}
               className="bg-white/95 hover:bg-blue-50 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs"
               aria-label="Reducir 5 minutos"
            >
               -5m
            </button>
            <button
               type="button"
               onClick={() => handleAdjustMinutes(-oneMinuteMs)}
               className="bg-white/95 hover:bg-blue-50 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs"
               aria-label="Reducir 1 minuto"
            >
               -1m
            </button>
         </div>
         <div className="pointer-events-none">
            <div
               className={`font-medium text-xs uppercase tracking-wide ${
                  isFinished ? "text-white" : isEndingSoon ? "text-orange-700" : "text-slate-500"
               }`}
            >
               Tiempo restante
            </div>
            <div
               className={`font-mono font-semibold tabular-nums text-4xl ${
                  isFinished
                     ? "text-current animate-countdown-blink"
                     : isEndingSoon
                       ? "text-orange-600 animate-pulse"
                       : "text-blue-700"
               }`}
            >
               {formatRemaining(remainingMs)}
            </div>
            {isFinished && <div className="font-bold text-white text-sm uppercase tracking-wide">Finalizado</div>}
         </div>
         <div className="top-1/2 right-2 absolute flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition -translate-y-1/2 duration-200 pointer-events-none group-hover:pointer-events-auto">
            <button
               type="button"
               onClick={() => handleAdjustMinutes(fiveMinutesMs)}
               className="bg-white/95 hover:bg-blue-50 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs"
               aria-label="Añadir 5 minutos"
            >
               +5m
            </button>
            <button
               type="button"
               onClick={() => handleAdjustMinutes(oneMinuteMs)}
               className="bg-white/95 hover:bg-blue-50 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs"
               aria-label="Añadir 1 minuto"
            >
               +1m
            </button>
         </div>
      </div>
   );
}
