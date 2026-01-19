"use server";

import type { SlideImage } from "../services/convertapiServices";
import { savePresentationAndSlides } from "../services/presentationServices";

export async function savePresentationWithSlidesAction({
   name,
   file,
   slides,
   hasVideo,
}: {
   name: string;
   file: File;
   slides: SlideImage[];
   hasVideo: boolean;
}): Promise<
   BackendResponse<{
      presentation: PresentationRecord;
      presentationSlides: PresentationSlideRecord[];
   }>
> {
   try {
      if (!name.trim()) {
         return {
            success: false,
            errorMessage: "El nombre es requerido",
         };
      }
      if (!file) {
         return {
            success: false,
            errorMessage: "Archivo de presentación requerido",
         };
      }
      if (!slides || slides.length === 0) {
         return {
            success: false,
            errorMessage: "No hay diapositivas para guardar",
         };
      }

      const presentationAndSlidesSaved = await savePresentationAndSlides({
         name,
         file,
         slides,
         hasVideo,
      });

      return {
         success: true,
         data: presentationAndSlidesSaved,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error al guardar la presentación",
      };
   }
}
