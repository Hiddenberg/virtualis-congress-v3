/* eslint-disable @next/next/no-img-element */
"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UnifiedControlsBar } from "@/components/UnifiedControlsBar";
import pbClient from "@/libs/pbClient";
import PresentationDrawingPlaybackOverlay from "./PresentationDrawingPlaybackOverlay";

export default function PresentationAndVideoPlayer({
   muxPlaybackId,
   presentationSlides,
   presentationRecording,
   isSmall = false,
}: {
   muxPlaybackId: string;
   presentationSlides: PresentationSlideRecord[];
   presentationRecording: PresentationRecordingRecord;
   isSmall?: boolean;
}) {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const playerRefs = useRef<(HTMLDivElement | null)[]>([null]);
   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

   const slideChanges = useMemo(() => {
      return presentationRecording?.slideChanges || [];
   }, [presentationRecording]);

   const sortedSlideChanges = useMemo(() => {
      return [...slideChanges].sort((a, b) => a.timestamp - b.timestamp);
   }, [slideChanges]);

   const getSlideIndexForTime = useCallback(
      (currentTimeMs: number) => {
         if (!sortedSlideChanges.length) return 0;

         let low = 0;
         let high = sortedSlideChanges.length - 1;
         let answerIndex = 0;

         while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (sortedSlideChanges[mid].timestamp <= currentTimeMs) {
               answerIndex = mid;
               low = mid + 1;
            } else {
               high = mid - 1;
            }
         }

         const candidate = sortedSlideChanges[answerIndex]?.slideIndex ?? 0;
         if (candidate < 0) return 0;
         if (candidate >= presentationSlides.length)
            return presentationSlides.length - 1;
         return candidate;
      },
      [sortedSlideChanges, presentationSlides.length],
   );

   useEffect(() => {
      // Attach listeners to the underlying <mux-player> element
      const playerEl = containerRef.current?.querySelector("mux-player") as
         | HTMLMediaElement
         | undefined;
      if (!playerEl) return;

      const updateFromPlayerTime = () => {
         const currentTimeMs = (playerEl.currentTime || 0) * 1000;
         const nextIndex = getSlideIndexForTime(currentTimeMs);
         setCurrentSlideIndex((prev) =>
            prev !== nextIndex ? nextIndex : prev,
         );
      };

      // Initialize slide at t=0
      updateFromPlayerTime();

      playerEl.addEventListener("timeupdate", updateFromPlayerTime);
      playerEl.addEventListener("seeked", updateFromPlayerTime);
      playerEl.addEventListener("loadedmetadata", updateFromPlayerTime);

      return () => {
         playerEl.removeEventListener("timeupdate", updateFromPlayerTime);
         playerEl.removeEventListener("seeked", updateFromPlayerTime);
         playerEl.removeEventListener("loadedmetadata", updateFromPlayerTime);
      };
   }, [sortedSlideChanges, presentationSlides.length, getSlideIndexForTime]);

   const currentSlide = presentationSlides[currentSlideIndex];

   return (
      <div
         ref={containerRef}
         className="flex flex-col justify-between bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden"
      >
         {/* Media area */}
         <div className="bg-black">
            <div className="items-stretch grid grid-cols-12">
               {/* Slide viewer (bigger) */}
               <div className="order-1 col-span-10">
                  <div className="relative flex justify-center items-center bg-gray-900 w-full aspect-video">
                     {currentSlide ? (
                        <>
                           <img
                              src={pbClient.files.getURL(
                                 currentSlide,
                                 currentSlide.image as string,
                              )}
                              alt={`Diapositiva ${currentSlideIndex + 1}`}
                              className="max-w-full max-h-full object-contain"
                           />
                           <PresentationDrawingPlaybackOverlay
                              containerRef={containerRef}
                              drawingEvents={
                                 presentationRecording?.drawingEvents
                              }
                              currentSlideIndex={currentSlideIndex}
                           />
                        </>
                     ) : (
                        <div className="text-gray-400">Sin diapositiva</div>
                     )}
                  </div>
               </div>

               {/* Camera video (smaller side) */}
               <div className="order-2 col-span-2">
                  <div
                     ref={(el) => {
                        // video container
                        playerRefs.current[0] = el;
                     }}
                     className="relative bg-black border border-white/10 rounded-lg aspect-video overflow-hidden"
                  >
                     <MuxPlayer
                        playbackId={muxPlaybackId}
                        stream-type="on-demand"
                        className="w-full h-full"
                        primary-color="#ffffff"
                        secondary-color="#000000"
                        accent-color="#fa50b5"
                        style={{
                           "--controls": "none",
                        }}
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Unified controls bar at bottom */}
         <div className="bg-gray-50 px-4 py-3 border-gray-200 border-t">
            <UnifiedControlsBar
               playerRefs={playerRefs}
               containerRef={containerRef}
               isSmall={isSmall}
            />
         </div>
      </div>
   );
}
