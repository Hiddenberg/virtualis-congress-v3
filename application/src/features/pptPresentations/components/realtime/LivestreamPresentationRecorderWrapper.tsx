"use client";

import React, { useEffect, useRef } from "react";
import { useRealtimeLivestreamStatus } from "@/features/livestreams/customHooks/useRealtimeLivestreamStatus";
import {
   PresentationRecorderProvider,
   usePresentationRecorder,
} from "@/features/pptPresentations/contexts/PresentationRecorderContext";
import { useRealtimePresentationState } from "@/features/pptPresentations/customHooks/useRealtimePresentationState";

function RecorderEffects({
   presentationId,
   livestreamSession,
}: {
   presentationId: string;
   livestreamSession: LivestreamSessionRecord;
}) {
   const {
      startRecording,
      stopRecording,
      recordSlideChange,
      savePresentationRecording,
      isRecording,
   } = usePresentationRecorder();
   const { livestreamStatus } = useRealtimeLivestreamStatus({
      livestreamSession,
   });
   const { state } = useRealtimePresentationState(presentationId);

   const wasStreamingRef = useRef<boolean>(false);
   const prevSlideIndexRef = useRef<number | null>(null);
   const saveRef = useRef(savePresentationRecording);

   // Keep latest save function without retriggering mount/unmount effect
   useEffect(() => {
      saveRef.current = savePresentationRecording;
   }, [savePresentationRecording]);

   // Start/stop and final save based on livestream status
   useEffect(() => {
      if (livestreamStatus === "streaming" && !wasStreamingRef.current) {
         startRecording();
         const initialIndex =
            typeof state?.currentSlideIndex === "number"
               ? state.currentSlideIndex
               : 0;
         recordSlideChange(initialIndex);
         prevSlideIndexRef.current = initialIndex;
         wasStreamingRef.current = true;
      } else if (livestreamStatus !== "streaming" && wasStreamingRef.current) {
         stopRecording();
         if (livestreamStatus === "ended") {
            void saveRef.current();
         }
         wasStreamingRef.current = false;
      }
   }, [
      livestreamStatus,
      startRecording,
      stopRecording,
      recordSlideChange,
      state?.currentSlideIndex,
   ]);

   // Record slide changes while streaming/recording
   useEffect(() => {
      if (!isRecording) return;
      const idx = state?.currentSlideIndex;
      if (typeof idx !== "number") return;
      if (prevSlideIndexRef.current === null) {
         prevSlideIndexRef.current = idx;
         return;
      }
      if (prevSlideIndexRef.current !== idx) {
         recordSlideChange(idx);
         prevSlideIndexRef.current = idx;
      }
   }, [isRecording, state?.currentSlideIndex, recordSlideChange]);

   // Best-effort save on unmount (run exactly once)
   useEffect(() => {
      return () => {
         void saveRef.current();
      };
   }, []);

   return null;
}

export default function LivestreamPresentationRecorderWrapper({
   presentationId,
   livestreamSession,
   children,
}: {
   presentationId: string;
   livestreamSession: LivestreamSessionRecord;
   children: React.ReactNode;
}) {
   return (
      <PresentationRecorderProvider presentationId={presentationId}>
         {children}
         <RecorderEffects
            presentationId={presentationId}
            livestreamSession={livestreamSession}
         />
      </PresentationRecorderProvider>
   );
}
