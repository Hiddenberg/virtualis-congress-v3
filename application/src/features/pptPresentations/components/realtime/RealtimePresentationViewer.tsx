/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRealtimePresentationState } from "@/features/pptPresentations/customHooks/useRealtimePresentationState";
import pbClient from "@/libs/pbClient";

export default function RealtimePresentationViewer({
   presentationId,
   showHeader = true,
}: {
   presentationId: string;
   showHeader?: boolean;
}) {
   const { state, isLoading: isLoadingState } =
      useRealtimePresentationState(presentationId);

   const { data: presentationSlides, isLoading } = useQuery<
      PresentationSlideRecord[]
   >({
      queryFn: async () => {
         const response = await fetch(
            `/api/presentation/${presentationId}/slides`,
         );
         const data = await response.json();
         return data;
      },
      queryKey: ["presentation-slides", presentationId],
   });

   const currentSlideIndex = useMemo(
      () => state?.currentSlideIndex ?? 0,
      [state?.currentSlideIndex],
   );
   const isHidden = useMemo(() => state?.isHidden ?? false, [state?.isHidden]);
   const currentSlideImage = presentationSlides?.[currentSlideIndex];

   return (
      <div className="bg-white shadow-xl mx-auto rounded-2xl overflow-hidden">
         {showHeader && (
            <div className="bg-gray-50 px-4 py-3 border-gray-200 border-b">
               <div className="flex justify-between items-center">
                  <h2 className="font-bold text-gray-900 text-xl">
                     Presentación
                  </h2>
                  <span className="text-gray-500 text-sm">
                     {currentSlideIndex + 1} de{" "}
                     {presentationSlides?.length ?? 0}
                  </span>
               </div>
            </div>
         )}

         <div className="bg-gray-900">
            <div className="flex justify-center items-center w-full aspect-video">
               {!presentationSlides || isLoading || isLoadingState ? (
                  <div className="text-gray-400">Cargando...</div>
               ) : presentationSlides.length === 0 ? (
                  <div className="text-gray-400">
                     No hay diapositivas para mostrar
                  </div>
               ) : currentSlideImage ? (
                  <img
                     src={pbClient.files.getURL(
                        currentSlideImage,
                        currentSlideImage.image as string,
                     )}
                     alt={`Diapositiva ${currentSlideIndex + 1}`}
                     className={`max-w-full max-h-full object-contain ${isHidden ? "opacity-30 blur-[1px]" : ""}`}
                  />
               ) : (
                  <div className="text-gray-400">Sin diapositiva</div>
               )}
            </div>
         </div>
      </div>
   );
}
