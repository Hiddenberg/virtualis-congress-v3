"use server";

import { convertPPTToImages, type SlideImage } from "../services/convertapiServices";

export async function convertPPTToImageAction(file: File, format: "png" | "webp"): Promise<BackendResponse<SlideImage[]>> {
   try {
      if (!file) {
         return {
            success: false,
            errorMessage: "No file provided",
         };
      }

      console.log("starting conversion");
      const slideImages = await convertPPTToImages(file, format);
      console.log("conversion finished");

      return {
         success: true,
         data: slideImages,
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
         errorMessage: "Error converting file",
      };
   }
}
