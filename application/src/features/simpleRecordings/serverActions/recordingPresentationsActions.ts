"use server";

import { revalidatePath } from "next/cache";
import { createRecordingPresentation, deleteRecordingPresentation } from "../services/recordingPresentationsServices";

export async function linkRecordingWithPresentationAction({
   recordingId,
   presentationId,
}: {
   recordingId: SimpleRecordingRecord["id"];
   presentationId: PresentationRecord["id"];
}): Promise<BackendResponse<RecordingPresentationRecord>> {
   try {
      if (!recordingId || !presentationId) {
         return {
            success: false,
            errorMessage: "Faltan datos para vincular la grabación con la presentación",
         };
      }

      const linked = await createRecordingPresentation(recordingId, presentationId);

      return {
         success: true,
         data: linked,
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
         errorMessage: "Error al vincular la grabación con la presentación",
      };
   }
}

export async function deleteRecordingPresentationAction({
   recordingId,
}: {
   recordingId: SimpleRecordingRecord["id"];
}): Promise<BackendResponse<null>> {
   try {
      await deleteRecordingPresentation(recordingId);

      revalidatePath("/recordings/record/[recordingId]", "page");
      return {
         success: true,
         data: null,
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
         errorMessage: "Error al eliminar la presentación de la grabación",
      };
   }
}
