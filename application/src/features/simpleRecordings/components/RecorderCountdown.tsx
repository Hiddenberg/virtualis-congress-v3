"use client";

import { useEffect, useState } from "react";
import { formatVideoTime } from "@/utils/recorderUtils";

export default function RecorderCountdown({
   durationSeconds,
   warningThresholdSeconds,
}: {
   durationSeconds: number;
   warningThresholdSeconds: number;
}) {
   const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

   useEffect(() => {
      const interval = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 0) {
               clearInterval(interval);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   const isWarning = timeLeft <= warningThresholdSeconds;

   return (
      <div>
         <p>Tiempo restante:</p>
         <p className={`font-bold text-xl ${isWarning ? "text-red-500 animate-pulse" : ""}`}>{formatVideoTime(timeLeft)}</p>
      </div>
   );
}
