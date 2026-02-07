"use client";

import { useConferenceCountdownContext } from "@/features/conferences/contexts/ConferenceCountdownContext";

interface ConferenceTimeBannerProps {
   className?: string;
}

export default function ConferenceTimeBanner({ className }: ConferenceTimeBannerProps) {
   const countdownContext = useConferenceCountdownContext();

   if (!countdownContext?.isFinished) {
      return null;
   }

   const baseClassName = "absolute top-0 left-0 right-0 z-10 bg-red-600 px-3 py-1 text-center";
   const bannerClassName = className ? `${baseClassName} ${className}` : baseClassName;

   return (
      <div className={bannerClassName}>
         <span className="font-semibold text-white text-sm uppercase tracking-wide">Tiempo</span>
      </div>
   );
}
