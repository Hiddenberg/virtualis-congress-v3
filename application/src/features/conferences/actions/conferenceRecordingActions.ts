"use server";

import { revalidatePath } from "next/cache";
import { checkAuthorizedUserFromServer } from "@/services/authServices";
import { linkRecordingToConference, unlinkRecordingFromConference } from "../services/conferenceRecordingsServices";

export async function linkRecordingToConferenceAction({
   conferenceId,
   recordingId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   recordingId: SimpleRecordingRecord["id"];
}): Promise<BackendResponse<null>> {
   const isAuthorized = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorized) {
      return {
         success: false,
         errorMessage: "Usuario no autorizado",
      };
   }

   try {
      await linkRecordingToConference({
         conferenceId,
         recordingId,
      });
      revalidatePath("/congress-admin/conferences", "layout");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      const err = error as Error;
      return {
         success: false,
         errorMessage: err.message,
      };
   }
}

export async function unlinkRecordingFromConferenceAction({
   conferenceId,
   recordingId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   recordingId: SimpleRecordingRecord["id"];
}): Promise<BackendResponse<null>> {
   const isAuthorized = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorized) {
      return {
         success: false,
         errorMessage: "Usuario no autorizado",
      };
   }

   try {
      await unlinkRecordingFromConference(conferenceId, recordingId);
      revalidatePath("/congress-admin/conferences", "layout");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      const err = error as Error;
      return {
         success: false,
         errorMessage: err.message,
      };
   }
}
