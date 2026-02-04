/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Eye, EyeOff, PresentationIcon } from "lucide-react";
import { useMemo } from "react";
import { useRealtimePresentationState } from "@/features/pptPresentations/customHooks/useRealtimePresentationState";
import pbClient from "@/libs/pbClient";

export default function RealtimePresentationController({ presentationId }: { presentationId: string }) {
   const { state, isLoading: isLoadingState, updateState } = useRealtimePresentationState(presentationId);

   const { data: presentationSlides, isLoading } = useQuery<PresentationSlideRecord[]>({
      queryFn: async () => {
         const response = await fetch(`/api/presentation/${presentationId}/slides`);
         const data = await response.json();
         return data;
      },
      queryKey: ["presentation-slides", presentationId],
   });

   const currentSlide = useMemo(() => state?.currentSlideIndex ?? 0, [state?.currentSlideIndex]);
   const isHidden = useMemo(() => state?.isHidden ?? false, [state?.isHidden]);

   if (!presentationSlides) return <div>No hay diapositivas para mostrar</div>;

   const goToNextSlide = () => {
      const next = (currentSlide + 1) % presentationSlides.length;
      updateState({
         currentSlideIndex: next,
      });
   };

   const goToPrevSlide = () => {
      const prev = (currentSlide - 1 + presentationSlides.length) % presentationSlides.length;
      updateState({
         currentSlideIndex: prev,
      });
   };

   const goToSlide = (index: number) => {
      if (index < 0 || index >= presentationSlides.length) {
         return;
      }

      updateState({
         currentSlideIndex: index,
      });
   };

   // Keyboard navigation
   // useEffect(() => {
   //    const handleKeyDown = (event: KeyboardEvent) => {
   //       switch (event.key) {
   //       case 'ArrowRight':
   //       case ' ':
   //          event.preventDefault()
   //          goToNextSlide()
   //          break
   //       case 'ArrowLeft':
   //          event.preventDefault()
   //          goToPrevSlide()
   //          break
   //       case 'Escape':
   //          setIsFullscreen(false)
   //          setSlideshowPlaying(false)
   //          break
   //       case 'f':
   //       case 'F':
   //          setIsFullscreen(!isFullscreen)
   //          break
   //       }
   //    }

   //    window.addEventListener('keydown', handleKeyDown)
   //    return () => window.removeEventListener('keydown', handleKeyDown)
   // }, [goToNextSlide, goToPrevSlide, isFullscreen])

   if (isLoading || isLoadingState || !state) {
      return <div>Loading...</div>;
   }

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
                  <h2 className="flex items-center gap-2 font-bold text-gray-900 text-xl">
                     <PresentationIcon className="w-6 h-6" />
                     Diapositiva
                  </h2>
                  <span className="text-gray-500 text-sm">
                     {currentSlide + 1} de {presentationSlides.length}
                  </span>
                  {isHidden && (
                     <span className="inline-flex items-center gap-1 bg-yellow-100 px-2 py-0.5 border border-yellow-200 rounded-full font-medium text-yellow-800 text-xs">
                        <EyeOff className="w-3 h-3" />
                        Oculta
                     </span>
                  )}
               </div>
               <div className="flex items-center gap-2">
                  <button
                     onClick={() =>
                        updateState({
                           isHidden: !isHidden,
                        })
                     }
                     className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${isHidden ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                     type="button"
                  >
                     {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                     {isHidden ? "Mostrar presentación" : "Ocultar presentación"}
                  </button>
               </div>
            </div>
         </div>

         {/* Main slide viewer */}
         <div className="relative bg-gray-900">
            <div className={`flex items-center justify-center h-[600px]`}>
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
                     className={`max-w-full max-h-full object-contain transition-transform duration-300 ${isHidden ? "opacity-30 blur-[1px]" : ""}`}
                  />

                  {/* Slide counter overlay */}
                  <div className="right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm">
                     {currentSlide + 1} / {presentationSlides.length}
                  </div>

                  {isHidden && (
                     <div className="absolute inset-0 flex justify-center items-center bg-gray-900/60 backdrop-blur-sm pointer-events-none">
                        <div className="text-white text-center">
                           <div className="flex justify-center items-center bg-white/10 mx-auto mb-3 rounded-full w-10 h-10">
                              <EyeOff className="w-5 h-5" />
                           </div>
                           <p className="font-semibold">Presentación oculta</p>
                           <p className="text-gray-200 text-sm">Los asistentes no la pueden ver.</p>
                        </div>
                     </div>
                  )}
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
                     <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
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
