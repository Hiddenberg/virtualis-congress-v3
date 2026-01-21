"use server";

import { revalidatePath } from "next/cache";
import { linkSpeakerToConference, unlinkSpeakerFromConference } from "@/features/conferences/services/conferenceSpeakersServices";
import { checkAuthorizedUserFromServer } from "@/services/authServices";

export async function linkSpeakersToConferenceAction({
   conferenceId,
   speakerIds,
}: {
   conferenceId: string;
   speakerIds: string[];
}): Promise<BackendResponse<null>> {
   const isAuthorizedUser = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      await Promise.all(
         speakerIds.map((speakerId) =>
            linkSpeakerToConference({
               speakerId,
               conferenceId,
            }),
         ),
      );
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

export async function unlinkSpeakersFromConferenceAction({
   conferenceId,
   speakerIds,
}: {
   conferenceId: string;
   speakerIds: string[];
}): Promise<BackendResponse<null>> {
   const isAuthorizedUser = checkAuthorizedUserFromServer(["admin", "super_admin"]);
   if (!isAuthorizedUser) {
      return {
         success: false,
         errorMessage: "Unauthorized user",
      };
   }

   try {
      await Promise.all(
         speakerIds.map((speakerId) =>
            unlinkSpeakerFromConference({
               speakerId,
               conferenceId,
            }),
         ),
      );
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
