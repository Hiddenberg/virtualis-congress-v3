"use server";

import { revalidatePath } from "next/cache";
import {
   linkPresentationToConference,
   unlinkPresentationFromConference,
} from "@/features/conferences/services/conferencePresentationsServices";

export async function linkPresentationToConferenceAction({
   conferenceId,
   presentationId,
}: {
   conferenceId: string;
   presentationId: string;
}): Promise<BackendResponse<null>> {
   try {
      if (!conferenceId || !presentationId) {
         return {
            success: false,
            errorMessage: "conferenceId and presentationId are required",
         };
      }

      await linkPresentationToConference(conferenceId, presentationId);
      revalidatePath("/congress-admin/conferences", "layout");
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
         errorMessage: "Error al vincular la presentación con la conferencia",
      };
   }
}

export async function unlinkPresentationFromConferenceAction({
   conferenceId,
}: {
   conferenceId: string;
}): Promise<BackendResponse<null>> {
   try {
      if (!conferenceId) {
         return {
            success: false,
            errorMessage: "conferenceId is required",
         };
      }
      await unlinkPresentationFromConference(conferenceId);
      revalidatePath("/congress-admin/conferences", "layout");
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
         errorMessage: "Error al desvincular la presentación de la conferencia",
      };
   }
}
