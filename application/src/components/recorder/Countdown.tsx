"use client";

import { useCallback, useEffect, useState } from "react";

// Types
export interface CountdownProps {
   /**
    * Time in milliseconds
    */
   duration: number;
   /**
    * Threshold in milliseconds when countdown should start blinking
    */
   warningThreshold?: number;
   /**
    * Callback function when countdown reaches zero
    */
   onComplete?: () => void;
   /**
    * Optional className for styling
    */
   className?: string;
}

/**
 * Custom hook to manage countdown logic
 */
const useCountdown = (duration: number, onComplete?: () => void) => {
   const [timeLeft, setTimeLeft] = useState(duration);
   const [isRunning, setIsRunning] = useState(true);

   const reset = useCallback(() => {
      setTimeLeft(duration);
      setIsRunning(true);
   }, [duration]);

   const pause = useCallback(() => {
      setIsRunning(false);
   }, []);

   const resume = useCallback(() => {
      setIsRunning(true);
   }, []);

   useEffect(() => {
      if (!isRunning) return;

      const interval = setInterval(() => {
         setTimeLeft((prevTime) => {
            if (prevTime <= 1000) {
               clearInterval(interval);
               setIsRunning(false);
               onComplete?.();
               return 0;
            }
            return prevTime - 1000;
         });
      }, 1000);

      return () => clearInterval(interval);
   }, [isRunning, onComplete]);

   return {
      timeLeft,
      isRunning,
      reset,
      pause,
      resume,
   };
};

/**
 * CountdownDisplay component to handle the visual presentation
 */
export const CountdownDisplay = ({
   seconds,
   isWarning,
   className,
}: {
   seconds: number;
   isWarning: boolean;
   className?: string;
}) => (
   <span
      className={`flex items-center gap-2 font-mono text-2xl font-bold transition-colors ${isWarning ? "animate-pulse text-red-500" : ""} ${className}`}
   >
      <span>{seconds}</span>
   </span>
);

/**
 * Main Countdown component
 */
export const Countdown = ({
   duration,
   warningThreshold = 10000, // Default 10 seconds
   onComplete,
   className,
}: CountdownProps) => {
   const { timeLeft } = useCountdown(duration, onComplete);

   // Convert milliseconds to seconds (rounded up)
   const secondsLeft = Math.ceil(timeLeft / 1000);

   // Determine if we should show the warning state
   const isWarning = timeLeft <= warningThreshold;

   return (
      <CountdownDisplay
         seconds={secondsLeft}
         isWarning={isWarning}
         className={className}
      />
   );
};

/**
 * Advanced Countdown component with controls
 */
export const CountdownWithControls = ({
   duration,
   warningThreshold = 10000,
   onComplete,
   className,
}: CountdownProps) => {
   const { timeLeft, isRunning, reset, pause, resume } = useCountdown(
      duration,
      onComplete,
   );

   const secondsLeft = Math.ceil(timeLeft / 1000);
   const isWarning = timeLeft <= warningThreshold;

   return (
      <section className={`flex flex-col gap-2 ${className}`}>
         <CountdownDisplay seconds={secondsLeft} isWarning={isWarning} />

         <nav className="flex gap-2">
            <button
               onClick={isRunning ? pause : resume}
               className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
               {isRunning ? "Pause" : "Resume"}
            </button>
            <button
               onClick={reset}
               className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
               Reset
            </button>
         </nav>
      </section>
   );
};

export default Countdown;
