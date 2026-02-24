"use server";

import { revalidatePath } from "next/cache";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import {
   linkSpeakerPresentationRecordingToConference,
   unlinkSpeakerPresentationRecordingFromConference,
} from "../services/conferenceSpeakerPresentationRecordingServices";
import type { CongressConferenceRecord } from "../types/conferenceTypes";

export async function linkSpeakerPresentationRecordingAction({
   conferenceId,
   recordingId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   recordingId: SimpleRecordingRecord["id"];
}): Promise<BackendResponse<null>> {
   try {
      await linkSpeakerPresentationRecordingToConference({
         conferenceId,
         recordingId,
      });
      revalidatePath("/congress-admin/conferences", "page");
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
         errorMessage: "Error al vincular la grabación de la presentación del ponente con la conferencia",
      };
   }
}

export async function unlinkSpeakerPresentationRecordingFromConferenceAction({
   conferenceId,
}: {
   conferenceId: CongressConferenceRecord["id"];
}): Promise<BackendResponse<null>> {
   try {
      await unlinkSpeakerPresentationRecordingFromConference({
         conferenceId,
      });

      revalidatePath("/congress-admin/conferences", "page");
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
         errorMessage: "Error al desvincular la grabación de la presentación del ponente de la conferencia",
      };
   }
}
