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
            if (next <= 0) {
               window.clearInterval(intervalId);
            }
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
      <div className="relative group bg-white shadow-sm p-4 py-2 border border-blue-100 rounded-xl w-full text-center">
         <button
            type="button"
            onClick={() => handleAdjustMinutes(-fiveMinutesMs)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm opacity-0 transition duration-200 hover:bg-blue-50 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Reducir 5 minutos"
         >
            -5m
         </button>
         <div className="font-medium text-slate-500 text-xs uppercase tracking-wide">Tiempo restante</div>
         <div className="mt-1 font-mono font-semibold tabular-nums text-blue-700 text-4xl">{formatRemaining(remainingMs)}</div>
         {isFinished && <div className="mt-2 font-medium text-rose-600 text-xs">Finalizado</div>}
         <button
            type="button"
            onClick={() => handleAdjustMinutes(fiveMinutesMs)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm opacity-0 transition duration-200 hover:bg-blue-50 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Añadir 5 minutos"
         >
            +5m
         </button>
      </div>
   );
}
