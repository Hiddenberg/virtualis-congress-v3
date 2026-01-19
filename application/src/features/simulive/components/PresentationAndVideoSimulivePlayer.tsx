/* eslint-disable @next/next/no-img-element */
"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PresentationDrawingPlaybackOverlay from "@/features/pptPresentations/components/PresentationDrawingPlaybackOverlay";
import pbClient from "@/libs/pbClient";
// import { isAfter, isBefore } from "@formkit/tempo"
import {
   getSimuliveVariables,
   type SimuliveData,
} from "../utils/simulivePlayerUtils";
import UnmuteOverlay from "./UnmuteOverlay";

export default function PresentationAndVideoSimulivePlayer({
   muxPlaybackId,
   presentationSlides,
   presentationRecording,
   simuliveData,
   onVideoFinished,
}: {
   muxPlaybackId: string;
   presentationSlides: PresentationSlideRecord[];
   presentationRecording: PresentationRecordingRecord;
   simuliveData: SimuliveData;
   onVideoFinished?: () => void;
}) {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
   const [isMuted, setIsMuted] = useState<boolean>(true);

   const slideChanges = useMemo(() => {
      return presentationRecording?.slideChanges || [];
   }, [presentationRecording]);

   const sortedSlideChanges = useMemo(() => {
      return [...slideChanges].sort((a, b) => a.timestamp - b.timestamp);
   }, [slideChanges]);

   // Precompute all slide image URLs and preload them on mount
   const slideImageUrls = useMemo(() => {
      return presentationSlides.map((slide) =>
         pbClient.files.getURL(slide, slide.image as string),
      );
   }, [presentationSlides]);

   const preloadedUrlsRef = useRef<Set<string>>(new Set());

   const preloadImage = useCallback((url: string): Promise<void> => {
      return new Promise((resolve) => {
         if (!url || preloadedUrlsRef.current.has(url)) {
            resolve();
            return;
         }
         const img = new Image();
         img.decoding = "async";
         img.setAttribute("fetchpriority", "low");
         img.onload = () => resolve();
         img.onerror = () => resolve();
         img.src = url;
         preloadedUrlsRef.current.add(url);
      });
   }, []);

   useEffect(() => {
      let cancelled = false;
      const BATCH_SIZE = 10;

      const preloadAll = async () => {
         for (
            let i = 0;
            i < slideImageUrls.length && !cancelled;
            i += BATCH_SIZE
         ) {
            const batch = slideImageUrls.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(preloadImage));
         }
      };

      preloadAll();
      return () => {
         cancelled = true;
      };
   }, [slideImageUrls, preloadImage]);

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

      const onEnded = () => {
         onVideoFinished?.();
         // setHasFinished(true)
      };

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
      playerEl.addEventListener("ended", onEnded);
      return () => {
         playerEl.removeEventListener("timeupdate", updateFromPlayerTime);
         playerEl.removeEventListener("seeked", updateFromPlayerTime);
         playerEl.removeEventListener("loadedmetadata", updateFromPlayerTime);
         playerEl.removeEventListener("ended", onEnded);
      };
   }, [
      sortedSlideChanges,
      presentationSlides.length,
      getSlideIndexForTime,
      onVideoFinished,
   ]);

   const currentSlide = presentationSlides[currentSlideIndex];

   // Convert server time to datetime
   const { timeVideoShouldStart } = useMemo(
      () => getSimuliveVariables(simuliveData),
      [simuliveData],
   );

   // if (isBefore(serverTimeDate, startDateTimeDate)) {
   //    return (
   //       <div>La conferencia aún no ha comenzado</div>
   //    )
   // }

   // if (isAfter(serverTimeDate, endDateTimeDate) || hasFinished) {
   //    return (
   //       <div>La conferencia ha terminado</div>
   //    )
   // }

   return (
      <div
         ref={containerRef}
         className="relative bg-white shadow-xl rounded-2xl w-full aspect-video overflow-hidden"
      >
         <UnmuteOverlay isMuted={isMuted} onClick={() => setIsMuted(false)} />

         {/* Media area */}
         <div className="flex items-center bg-black w-full aspect-video">
            <div className="items-stretch grid grid-cols-12">
               {/* Slide viewer (bigger) */}
               <div className="order-1 col-span-10">
                  <div className="relative flex justify-center items-center bg-gray-900 w-full aspect-video">
                     {currentSlide ? (
                        <>
                           <img
                              src={slideImageUrls[currentSlideIndex]}
                              alt={`Diapositiva ${currentSlideIndex + 1}`}
                              className="max-w-full max-h-full object-contain"
                              loading="eager"
                              decoding="async"
                              fetchPriority="high"
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
                  <div className="relative bg-black border border-white/10 rounded-lg aspect-video overflow-hidden">
                     <MuxPlayer
                        playbackId={muxPlaybackId}
                        stream-type="on-demand"
                        className="w-full h-full pointer-events-none"
                        primary-color="#ffffff"
                        secondary-color="#000000"
                        startTime={timeVideoShouldStart}
                        accent-color="#fa50b5"
                        autoPlay="any"
                        muted={isMuted}
                        style={{
                           "--controls": "none",
                        }}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
