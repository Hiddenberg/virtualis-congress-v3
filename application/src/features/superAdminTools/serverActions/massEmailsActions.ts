"use server";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { sendSpeakerPresentationUploadReminderEmailToAllSpeakers } from "@/features/emails/services/massEmailSendingServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkUserAuthorization } from "@/features/users/services/userServices";

async function checkIfUserIsSuperAdmin() {
   const userId = await getLoggedInUserId();
   const isAuthorized = await checkUserAuthorization(userId ?? "", ["super_admin"]);
   if (!isAuthorized) {
      throw new Error("User is not authorized to perform this action");
   }
}

export async function sendSpeakerPresentationUploadReminderEmailToAllSpeakersAction(): Promise<BackendResponse<unknown>> {
   try {
      await checkIfUserIsSuperAdmin();

      const congress = await getLatestCongress();

      const result = await sendSpeakerPresentationUploadReminderEmailToAllSpeakers(congress.id);

      return {
         success: true,
         successMessage: result.successMessage,
         data: result,
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
         errorMessage: "An unknown error occurred",
      };
   }
}
