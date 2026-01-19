"use client";

import { useEffect, useState } from "react";

function BreakBanner() {
   const [isBreakTime, setIsBreakTime] = useState(false);

   const checkBreakTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check if time is between 11:30 and 12:00
      const isInBreakTimeRange =
         (hours === 11 && minutes >= 30) || (hours === 12 && minutes === 0);

      setIsBreakTime(isInBreakTimeRange);
   };

   useEffect(() => {
      // Check immediately on mount
      checkBreakTime();

      // Set up interval to check every 5 seconds
      const interval = setInterval(checkBreakTime, 5000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
   }, []);

   if (!isBreakTime) return null;

   return (
      <div className="bg-yellow-400 px-4 py-3 rounded-lg w-full text-center animate-pulse">
         <p className="font-medium text-black text-lg">
            🕐 Tiempo de Descanso del Congreso 🕐
         </p>
         <p className="mt-1 text-black text-sm">
            Las conferencias se reanudarán a las 12:00 PM
         </p>
      </div>
   );
}

export default BreakBanner;
