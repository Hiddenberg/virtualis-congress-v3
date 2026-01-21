"use client";

import { format } from "@formkit/tempo";
import { CalendarDays, Clock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface WaitingToStartScreenProps {
   conferenceTitle?: string;
   startTime: string;
   serverTime?: string;
   serverTimeOffsetMs?: number;
   onTimeOut?: () => void;
}

export default function WaitingToStartScreen({
   conferenceTitle,
   startTime,
   serverTime,
   serverTimeOffsetMs,
   onTimeOut,
}: WaitingToStartScreenProps) {
   const startDate = useMemo(() => new Date(startTime), [startTime]);

   const offsetMs = useMemo(() => {
      if (typeof serverTimeOffsetMs === "number") return serverTimeOffsetMs;
      if (serverTime) {
         const serverTimeDate = new Date(serverTime);
         const serverMs = serverTimeDate.getTime();
         const clientMs = Date.now();
         return serverMs - clientMs;
      }
      return 0;
   }, [serverTime, serverTimeOffsetMs]);

   const [now, setNow] = useState<Date>(() => new Date(Date.now() + offsetMs));
   const hasFiredTimeoutRef = useRef(false);

   useEffect(() => {
      const id = setInterval(() => {
         setNow(new Date(Date.now() + offsetMs));
      }, 1000);
      return () => clearInterval(id);
   }, [offsetMs]);

   const remainingSeconds = Math.max(0, Math.floor((startDate.getTime() - now.getTime()) / 1000));

   // Fire onTimeOut once at zero
   useEffect(() => {
      if (remainingSeconds === 0 && onTimeOut && !hasFiredTimeoutRef.current) {
         hasFiredTimeoutRef.current = true;
         onTimeOut();
      }
   }, [remainingSeconds, onTimeOut]);

   const days = Math.floor(remainingSeconds / 86400);
   const hours = Math.floor((remainingSeconds % 86400) / 3600);
   const minutes = Math.floor((remainingSeconds % 3600) / 60);
   const seconds = remainingSeconds % 60;

   const formattedStartTime = useMemo(
      () =>
         format({
            date: startTime,
            format: "DD MMM YYYY hh:mm A",
            tz: "America/Mexico_City",
         }),
      [startTime],
   );

   return (
      <div className="flex flex-col justify-center items-center bg-blue-50 mb-4 p-4 border border-blue-200 rounded-lg aspect-video">
         <div className="flex items-center gap-2">
            <Clock className="text-blue-700 size-6" />
            <h2 className="font-semibold text-blue-900 text-lg">La transmisión comenzará pronto</h2>
         </div>

         {conferenceTitle && <p className="mt-1 text-blue-700 text-center">{conferenceTitle}</p>}

         <div className="flex items-center gap-2 mt-2 text-blue-700">
            <CalendarDays className="size-4" />
            <p>Inicio programado: {formattedStartTime}</p>
         </div>

         <div className="mt-4">
            <div className="flex gap-2 font-semibold text-blue-900 text-2xl sm:text-3xl">
               {days > 0 && <span className="tabular-nums">{days}d</span>}
               <span className="tabular-nums">{hours}h</span>
               <span className="tabular-nums">{minutes}m</span>
               <span className="tabular-nums">{seconds}s</span>
            </div>
            <p className="mt-1 text-blue-700 text-center text-sm">Tiempo restante</p>
         </div>
      </div>
   );
}
