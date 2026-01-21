"use client";
import React, { createContext, useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocalPresentationRecording } from "../hooks/useLocalPresentationRecording";
import { savePresentationRecordingAction } from "../serverActions/presentationRecordingActions";

interface PresentationRecorderContextType {
   isRecording: boolean;
   presentationId: string;
   stopRecording: () => void;
   startRecording: () => void;
   resumeRecording: () => void;
   recordSlideChange: (slideIndex: number) => void;
   savePresentationRecording: () => Promise<void>;
   hasPersistedData: boolean;
   lastRecordedSlideIndex: number | null;
}

export const PresentationRecorderContext = createContext<PresentationRecorderContextType | null>(null);

export function usePresentationRecorder() {
   const ctx = React.useContext(PresentationRecorderContext);
   if (!ctx) {
      throw new Error("usePresentationRecorder must be used within PresentationRecorderProvider");
   }
   return ctx;
}

export function PresentationRecorderProvider({
   presentationId,
   children,
}: {
   presentationId: string;
   children: React.ReactNode;
}) {
   const [isRecording, setIsRecording] = useState<boolean>(false);
   const [slideChanges, setSlideChanges] = useState<{ slideIndex: number; timestamp: number }[]>([]);
   const startTimeRef = useRef<number | null>(null);
   const local = useLocalPresentationRecording(presentationId);

   const startRecording = useCallback(() => {
      setIsRecording(true);
      const now = Date.now();
      startTimeRef.current = now;
      setSlideChanges([]);
      local.start();
   }, [local]);

   const resumeRecording = useCallback(() => {
      // Load persisted timeline and continue using original start time
      if (local.persisted) {
         startTimeRef.current = local.persisted.startedAtMs;
         setSlideChanges(local.persisted.slideChanges);
      } else {
         // If no persisted data exists, treat as fresh start
         startTimeRef.current = Date.now();
         setSlideChanges([]);
         local.start();
      }
      setIsRecording(true);
   }, [local]);

   const stopRecording = useCallback(() => {
      setIsRecording(false);
      startTimeRef.current = null;
   }, []);

   const recordSlideChange = useCallback(
      (slideIndex: number) => {
         const startTime = startTimeRef.current;
         if (!startTime) return;

         if (isRecording) {
            setSlideChanges((prev) => [
               ...prev,
               {
                  slideIndex,
                  timestamp: Date.now() - startTime,
               },
            ]);
            // Also persist locally
            local.appendSlideChange(slideIndex);
         }
      },
      [isRecording, local],
   );

   const savePresentationRecording = useCallback(async () => {
      if (slideChanges.length === 0) return;

      const savePresentationRecordingResponse = await savePresentationRecordingAction(presentationId, slideChanges);
      if (!savePresentationRecordingResponse.success) {
         toast.error(savePresentationRecordingResponse.errorMessage);
         return;
      }

      toast.success("Grabación de presentación guardada");
      setSlideChanges([]);
      // Clear local persisted data after successful save
      local.clear();
   }, [presentationId, slideChanges, local]);

   const lastRecordedSlideIndex = useMemo(() => {
      if (slideChanges.length === 0) return null;
      return slideChanges[slideChanges.length - 1].slideIndex;
   }, [slideChanges]);

   const value = useMemo(
      () => ({
         isRecording,
         presentationId,
         stopRecording,
         startRecording,
         resumeRecording,
         recordSlideChange,
         savePresentationRecording,
         hasPersistedData: Boolean(local.persisted && local.persisted.slideChanges.length > 0),
         lastRecordedSlideIndex,
      }),
      [
         isRecording,
         presentationId,
         stopRecording,
         startRecording,
         resumeRecording,
         recordSlideChange,
         savePresentationRecording,
         local.persisted,
         lastRecordedSlideIndex,
      ],
   );

   return <PresentationRecorderContext.Provider value={value}>{children}</PresentationRecorderContext.Provider>;
}
