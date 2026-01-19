"use server";

import {
   getPresentationRecordingByPresentationId,
   savePresentationRecording,
} from "../services/presentationRecordingServices";

export async function savePresentationRecordingAction(
   presentationId: string,
   slideChanges: PresentationRecordingSlideChange[],
): Promise<BackendResponse<PresentationRecordingRecord>> {
   try {
      if (!presentationId) {
         return {
            success: false,
            errorMessage: "presentationId is required",
         };
      }
      if (!Array.isArray(slideChanges)) {
         return {
            success: false,
            errorMessage: "slideChanges must be an array",
         };
      }

      const saved = await savePresentationRecording(
         presentationId,
         slideChanges,
      );
      return {
         success: true,
         data: saved,
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
         errorMessage: "Error saving presentation recording",
      };
   }
}

export async function getPresentationRecordingByPresentationIdAction(
   presentationId: string,
): Promise<BackendResponse<PresentationRecordingRecord | null>> {
   try {
      if (!presentationId) {
         return {
            success: false,
            errorMessage: "presentationId is required",
         };
      }

      const recording =
         await getPresentationRecordingByPresentationId(presentationId);
      return {
         success: true,
         data: recording,
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
         errorMessage: "Error fetching presentation recording",
      };
   }
}
