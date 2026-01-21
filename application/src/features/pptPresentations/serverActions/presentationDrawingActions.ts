"use server";

import { savePresentationDrawingEvents } from "../services/presentationDrawingServices";

export async function savePresentationDrawingEventsAction(
   presentationId: string,
   drawingEvents: PresentationDrawingEvent[],
): Promise<BackendResponse<PresentationRecordingRecord>> {
   try {
      if (!presentationId) {
         return {
            success: false,
            errorMessage: "presentationId is required",
         };
      }
      if (!Array.isArray(drawingEvents)) {
         return {
            success: false,
            errorMessage: "drawingEvents must be an array",
         };
      }

      const saved = await savePresentationDrawingEvents(presentationId, drawingEvents);
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
         errorMessage: "Error saving drawing events",
      };
   }
}
