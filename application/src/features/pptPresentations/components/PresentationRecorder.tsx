/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight, Eraser, Pencil } from "lucide-react";
import type React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import pbClient from "@/libs/pbClient";
import { usePresentationDrawing } from "../contexts/PresentationDrawingContext";
import { PresentationRecorderContext } from "../contexts/PresentationRecorderContext";
import PresentationDrawingOverlay from "./PresentationDrawingOverlay";

export default function PresentationRecorder({ presentationSlides }: { presentationSlides: PresentationSlideRecord[] }) {
   const [currentSlide, setCurrentSlide] = useState(0);

   // Navigation functions
   const recorder = useContext(PresentationRecorderContext);
   const drawing = usePresentationDrawing();
   const prevSlideRef = useRef<number>(0);

   console.log("presentation recorder rendered");

   // Record slide change via effect so navigation stays pure
   useEffect(() => {
      if (!recorder) return;
      // Clear lines on slide change
      if (!recorder.isRecording) {
         prevSlideRef.current = currentSlide;
         return;
      }
      if (prevSlideRef.current !== currentSlide) {
         if (drawing) {
            drawing.clearLines(currentSlide, "slide_change");
         }
         recorder.recordSlideChange(currentSlide);
         prevSlideRef.current = currentSlide;
      }
   }, [currentSlide, recorder, drawing]);

   // On recording start, jump to last recorded slide (if any) and record it once
   const wasRecordingRef = useRef<boolean>(false);
   useEffect(() => {
      if (!recorder) return;
      if (recorder.isRecording && !wasRecordingRef.current) {
         const desiredSlide = recorder.lastRecordedSlideIndex ?? currentSlide;
         if (desiredSlide !== currentSlide) {
            setCurrentSlide(desiredSlide);
         }
         recorder.recordSlideChange(desiredSlide);
         prevSlideRef.current = desiredSlide;
      }
      wasRecordingRef.current = recorder.isRecording;
   }, [recorder, recorder?.isRecording, currentSlide]);

   const goToNextSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % presentationSlides.length);
   }, [presentationSlides.length]);

   const goToPrevSlide = useCallback(() => {
      setCurrentSlide((prev) => (prev - 1 + presentationSlides.length) % presentationSlides.length);
   }, [presentationSlides.length]);

   const goToSlide = useCallback(
      (index: number) => {
         if (index < 0 || index >= presentationSlides.length) {
            return;
         }

         setCurrentSlide(index);
      },
      [presentationSlides.length],
   );

   if (presentationSlides.length === 0) {
      return (
         <div className="py-12 text-center">
            <p className="text-gray-500">No hay diapositivas para mostrar</p>
         </div>
      );
   }

   const currentSlideImage = presentationSlides[currentSlide];

   return (
      <div className={`bg-white rounded-2xl shadow-xl !border !border-gray-200 overflow-hidden max-w-[150dvh] mx-auto`}>
         {/* Header with controls */}
         <div className="bg-gray-50 p-4 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <h2 className="font-bold text-gray-900 text-xl">Diapositiva Convertida</h2>
                  <span className="text-gray-500 text-sm">
                     {currentSlide + 1} de {presentationSlides.length}
                  </span>
               </div>

               <div className="flex items-center gap-2 min-h-[1.5rem]">
                  <button
                     onClick={() => drawing?.setDrawingMode(!drawing?.isDrawingMode)}
                     className={`px-3 py-1.5 rounded-md border text-sm ${
                        drawing?.isDrawingMode
                           ? "bg-blue-600 text-white border-blue-600"
                           : "bg-blue-400 text-white border-blue-300 hover:bg-blue-500"
                     }`}
                  >
                     <span className="inline-flex items-center gap-2">
                        <Pencil className="w-4 h-4" /> {drawing?.isDrawingMode ? "Laser Activo" : "Laser"}
                     </span>
                  </button>
                  <button
                     onClick={() => drawing?.clearLines(currentSlide, "manual")}
                     className="bg-red-400 hover:bg-red-500 px-3 py-1.5 border border-gray-300 rounded-md text-white text-sm"
                  >
                     <span className="inline-flex items-center gap-2">
                        <Eraser className="w-4 h-4" /> Limpiar
                     </span>
                  </button>
                  {recorder?.isRecording && (
                     <span className="flex items-center gap-2 font-medium text-red-600">
                        <span className="inline-block bg-red-600 rounded-full w-2.5 h-2.5 animate-pulse" />
                        Recording
                     </span>
                  )}
               </div>
            </div>
         </div>

         {/* Main slide viewer */}
         <div className="relative bg-gray-900">
            <div className={`flex items-center justify-center`}>
               {/* Previous button */}
               <button
                  onClick={goToPrevSlide}
                  className="left-4 z-10 absolute bg-black/50 hover:bg-black/70 p-3 rounded-full text-white hover:scale-110 transition-all duration-200"
                  disabled={presentationSlides.length <= 1}
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>

               {/* Slide image */}
               <div className="relative flex justify-center items-center bg-gray-900 w-full aspect-video">
                  <img
                     src={pbClient.files.getURL(currentSlideImage, currentSlideImage.image as string)}
                     alt={`Diapositiva ${currentSlide + 1}`}
                     className="max-w-full max-h-full object-contain transition-transform duration-300"
                     // style={{
                     //    transform: `scale(${zoom})`
                     // }}
                  />
                  <PointerCaptureDrawingLayer currentSlide={currentSlide} />

                  {/* Slide counter overlay */}
                  <div className="right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm">
                     {currentSlide + 1} / {presentationSlides.length}
                  </div>
               </div>

               {/* Next button */}
               <button
                  onClick={goToNextSlide}
                  className="right-4 z-10 absolute bg-black/50 hover:bg-black/70 p-3 rounded-full text-white hover:scale-110 transition-all duration-200"
                  disabled={presentationSlides.length <= 1}
               >
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>
         </div>

         {/* Thumbnails navigation */}
         <div className="bg-gray-50 p-4 border-gray-200 border-t">
            <div className="flex gap-3 pb-2 overflow-x-auto">
               {presentationSlides.map((slide, index) => (
                  <button
                     key={slide.id}
                     onClick={() => goToSlide(index)}
                     className={`flex-shrink-0 relative border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                        index === currentSlide ? "border-yellow-400 shadow-lg" : "border-gray-300 hover:border-gray-400"
                     }`}
                  >
                     <img
                        src={pbClient.files.getURL(slide, slide.image as string)}
                        alt={`Miniatura ${index + 1}`}
                        className="w-24 h-16 object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <span className="bottom-1 left-1 absolute font-medium text-white text-xs">{index + 1}</span>
                     </div>
                     {index === currentSlide && (
                        <div className="-top-1 -right-1 absolute bg-yellow-400 border border-white rounded-full w-3 h-3" />
                     )}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
}

function PointerCaptureDrawingLayer({ currentSlide }: { currentSlide: number }) {
   const { isDrawingMode, addLine } = usePresentationDrawing();
   const containerRef = useRef<HTMLDivElement>(null);
   const startRef = useRef<{ x: number; y: number } | null>(null);
   const previewRef = useRef<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
   } | null>(null);
   const [, forceRender] = useState(0);

   const toNormalized = useCallback((clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect)
         return {
            x: 0,
            y: 0,
         };
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      return {
         x: Math.min(Math.max(x, 0), 1),
         y: Math.min(Math.max(y, 0), 1),
      };
   }, []);

   const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
         if (!isDrawingMode) return;
         (e.target as HTMLElement).setPointerCapture(e.pointerId);
         const pos = toNormalized(e.clientX, e.clientY);
         startRef.current = pos;
      },
      [isDrawingMode, toNormalized],
   );

   const onPointerMove = useCallback(
      (e: React.PointerEvent) => {
         if (!isDrawingMode) return;
         const start = startRef.current;
         if (!start) return;
         const end = toNormalized(e.clientX, e.clientY);
         previewRef.current = {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
         };
         forceRender((v) => v + 1);
      },
      [isDrawingMode, toNormalized],
   );

   const onPointerUp = useCallback(
      (e: React.PointerEvent) => {
         if (!isDrawingMode) return;
         const start = startRef.current;
         if (!start) return;
         const end = toNormalized(e.clientX, e.clientY);
         startRef.current = null;
         previewRef.current = null;
         addLine(
            {
               x1: start.x,
               y1: start.y,
               x2: end.x,
               y2: end.y,
            },
            currentSlide,
         );
      },
      [addLine, currentSlide, isDrawingMode, toNormalized],
   );

   return (
      <div
         ref={containerRef}
         className={`absolute inset-0 ${isDrawingMode ? "cursor-crosshair pointer-events-auto" : "pointer-events-none"}`}
         onPointerDown={onPointerDown}
         onPointerMove={onPointerMove}
         onPointerUp={onPointerUp}
      >
         <PresentationDrawingOverlay previewLine={previewRef.current || undefined} />
      </div>
   );
}
