"use client";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PresentationRecorderContext } from "../contexts/PresentationRecorderContext";
import { savePresentationDrawingEventsAction } from "../serverActions/presentationDrawingActions";

interface LineSegment {
   x1: number;
   y1: number;
   x2: number;
   y2: number;
}

interface PresentationDrawingContextType {
   isDrawingMode: boolean;
   setDrawingMode: (enabled: boolean) => void;
   lines: LineSegment[];
   addLine: (line: LineSegment, slideIndex: number) => void;
   clearLines: (slideIndex: number, reason?: "manual" | "slide_change") => void;
   saveDrawingEvents: () => Promise<void>;
}

export const PresentationDrawingContext = createContext<PresentationDrawingContextType | null>(null);

export function usePresentationDrawing() {
   const ctx = useContext(PresentationDrawingContext);
   if (!ctx) {
      throw new Error("usePresentationDrawing must be used within PresentationDrawingProvider");
   }
   return ctx;
}

export function PresentationDrawingProvider({ presentationId, children }: { presentationId: string; children: React.ReactNode }) {
   const recorder = useContext(PresentationRecorderContext);
   const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
   const [lines, setLines] = useState<LineSegment[]>([]);
   const drawingEventsRef = useRef<PresentationDrawingEvent[]>([]);
   const drawingStartTimeRef = useRef<number | null>(null);

   // Sync start time with presentation recording start
   const isRecording = !!recorder?.isRecording;
   const presentationIdMemo = presentationId;

   React.useEffect(() => {
      if (isRecording && drawingStartTimeRef.current === null) {
         drawingStartTimeRef.current = Date.now();
      }
      if (!isRecording) {
         drawingStartTimeRef.current = null;
      }
   }, [isRecording]);

   const getRelativeTimestamp = useCallback(() => {
      const start = drawingStartTimeRef.current;
      if (!start) return 0;
      return Date.now() - start;
   }, []);

   const addLine = useCallback(
      (line: LineSegment, slideIndex: number) => {
         setLines((prev) => [...prev, line]);
         if (isRecording) {
            drawingEventsRef.current.push({
               type: "add",
               slideIndex,
               timestamp: getRelativeTimestamp(),
               line: line,
            });
         }
      },
      [getRelativeTimestamp, isRecording],
   );

   const clearLines = useCallback(
      (slideIndex: number, reason: "manual" | "slide_change" = "manual") => {
         setLines([]);
         if (isRecording) {
            drawingEventsRef.current.push({
               type: "clear",
               slideIndex,
               timestamp: getRelativeTimestamp(),
            });
         }
      },
      [getRelativeTimestamp, isRecording],
   );

   const setDrawingMode = useCallback((enabled: boolean) => {
      setIsDrawingMode(enabled);
   }, []);

   const saveDrawingEvents = useCallback(async () => {
      const events = drawingEventsRef.current;
      if (!events.length) return;
      const res = await savePresentationDrawingEventsAction(presentationIdMemo, events);
      if (!res.success) {
         toast.error(res.errorMessage);
         return;
      }
      drawingEventsRef.current = [];
      toast.success("Dibujos guardados");
   }, [presentationIdMemo]);

   const ctxValue = useMemo<PresentationDrawingContextType>(
      () => ({
         isDrawingMode,
         setDrawingMode,
         lines,
         addLine,
         clearLines,
         saveDrawingEvents,
      }),
      [isDrawingMode, lines, addLine, clearLines, saveDrawingEvents, setDrawingMode],
   );

   return <PresentationDrawingContext.Provider value={ctxValue}>{children}</PresentationDrawingContext.Provider>;
}
