"use server";

import { createRecordingCampaign } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import type { SimpleRecordingCampaignRecord } from "../types/recordingsTypes";

export async function createRecordingCampaignAction(
   title: string,
   description: string,
): Promise<BackendResponse<SimpleRecordingCampaignRecord>> {
   try {
      const campaignCreated = await createRecordingCampaign(title, description);

      return {
         success: true,
         data: campaignCreated,
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
         errorMessage: "Error al crear la campaña de grabación",
      };
   }
}
