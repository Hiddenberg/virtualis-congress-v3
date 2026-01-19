"use client";

import { useEffect, useMemo, useState } from "react";

export default function ConferenceCountdown({
   conference,
}: {
   conference: CongressConferenceRecord;
}) {
   const startDate = useMemo(
      () => new Date(conference.startTime),
      [conference.startTime],
   );
   const endDate = useMemo(
      () => new Date(conference.endTime),
      [conference.endTime],
   );

   const startMs = useMemo(() => startDate.getTime(), [startDate]);
   const endMs = useMemo(() => endDate.getTime(), [endDate]);
   const durationMs = useMemo(
      () => Math.max(0, endMs - startMs),
      [endMs, startMs],
   );

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

   return (
      <div className="bg-white shadow-sm p-4 border border-blue-100 rounded-xl w-full text-center">
         <div className="font-medium text-slate-500 text-xs uppercase tracking-wide">
            Tiempo restante
         </div>
         <div className="mt-1 font-mono font-semibold tabular-nums text-blue-700 text-5xl">
            {formatRemaining(remainingMs)}
         </div>
         {isFinished && (
            <div className="mt-2 font-medium text-rose-600 text-xs">
               Finalizado
            </div>
         )}
      </div>
   );
}
