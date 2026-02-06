"use client";

import { useEffect, useMemo, useState } from "react";

export default function ConferenceCountdown({ conference }: { conference: CongressConferenceRecord }) {
   const startDate = useMemo(() => new Date(conference.startTime), [conference.startTime]);
   const endDate = useMemo(() => new Date(conference.endTime), [conference.endTime]);

   const startMs = useMemo(() => startDate.getTime(), [startDate]);
   const endMs = useMemo(() => endDate.getTime(), [endDate]);
   const durationMs = useMemo(() => Math.max(0, endMs - startMs), [endMs, startMs]);

   const [remainingMs, setRemainingMs] = useState<number>(() => durationMs);

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

   const handleAdjustMinutes = (deltaMs: number) => {
      setRemainingMs((prev) => Math.max(0, prev + deltaMs));
   };

   return (
      <div
         className={`group relative p-4 py-2 rounded-xl w-full text-center transition-all duration-300 ${
            isFinished
               ? "bg-rose-50 shadow-lg border-2 border-rose-300 ring-2 ring-rose-200"
               : "bg-white shadow-sm border border-blue-100"
         }`}
      >
         <button
            type="button"
            onClick={() => handleAdjustMinutes(-fiveMinutesMs)}
            className="top-1/2 left-2 absolute bg-white/95 hover:bg-blue-50 opacity-0 group-hover:opacity-100 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs transition -translate-y-1/2 duration-200 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Reducir 5 minutos"
         >
            -5m
         </button>
         <div className={`pointer-events-none ${isFinished ? "animate-pulse" : ""}`}>
            <div className={`font-medium text-xs uppercase tracking-wide ${isFinished ? "text-rose-700" : "text-slate-500"}`}>
               Tiempo restante
            </div>
            <div className={`font-mono font-semibold tabular-nums text-4xl ${isFinished ? "text-rose-600" : "text-blue-700"}`}>
               {formatRemaining(remainingMs)}
            </div>
            {isFinished && <div className="font-bold text-rose-700 text-sm uppercase tracking-wide">Finalizado</div>}
         </div>
         <button
            type="button"
            onClick={() => handleAdjustMinutes(fiveMinutesMs)}
            className="top-1/2 right-2 absolute bg-white/95 hover:bg-blue-50 opacity-0 group-hover:opacity-100 shadow-sm px-2.5 py-1 border border-blue-100 rounded-full font-semibold text-blue-700 text-xs transition -translate-y-1/2 duration-200 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Añadir 5 minutos"
         >
            +5m
         </button>
      </div>
   );
}
