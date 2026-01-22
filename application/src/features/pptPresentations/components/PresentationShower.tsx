/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import pbClient from "@/libs/pbClient";

export default function PresentationViewer({ presentationSlides }: { presentationSlides: PresentationSlideRecord[] }) {
   const [currentSlide, setCurrentSlide] = useState(0);

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
      <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-3xl mx-auto`}>
         {/* Header with controls */}
         <div className="bg-gray-50 p-4 border-gray-200 border-b">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <h2 className="font-bold text-gray-900 text-xl">Diapositiva del ponente</h2>
                  <span className="text-gray-500 text-sm">
                     {currentSlide + 1} de {presentationSlides.length}
                  </span>
               </div>
            </div>
         </div>

         {/* Main slide viewer */}
         <div className="relative bg-gray-900">
            <div className={`flex items-center justify-center`}>
               {/* Previous button */}
               <button
                  type="button"
                  onClick={goToPrevSlide}
                  className="left-4 z-10 absolute bg-black/50 hover:bg-black/70 p-3 rounded-full text-white hover:scale-110 transition-all duration-200"
                  disabled={presentationSlides.length <= 1}
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>

               {/* Slide image */}
               <div className="relative max-w-full max-h-full overflow-hidden">
                  <img
                     src={pbClient.files.getURL(currentSlideImage, currentSlideImage.image as string)}
                     alt={`Diapositiva ${currentSlide + 1}`}
                     className="max-w-full max-h-full object-contain transition-transform duration-300"
                     // style={{
                     //    transform: `scale(${zoom})`
                     // }}
                  />

                  {/* Slide counter overlay */}
                  <div className="right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm">
                     {currentSlide + 1} / {presentationSlides.length}
                  </div>
               </div>

               {/* Next button */}
               <button
                  type="button"
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
                     type="button"
                     key={slide.id}
                     onClick={() => goToSlide(index)}
                     className={`shrink-0 relative border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
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
