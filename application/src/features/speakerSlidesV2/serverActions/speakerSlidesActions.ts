"use server";

import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { checkUserAuthorization } from "@/features/users/services/userServices";
import { deleteSpeakerSlidesFile } from "../services/speakerSlidesFilesServices";

export async function deleteSpeakerSlidesFileAction(fileId: string): Promise<BackendResponse<null>> {
   try {
      // Check if the user is authorized to delete the file
      const userId = await getLoggedInUserId();
      const isAuthorized = await checkUserAuthorization(userId ?? "", ["admin"]);
      if (!isAuthorized) {
         return {
            success: false,
            errorMessage: "User is not authorized to delete this file",
         };
      }

      // Delete the file from Google Drive and the database record
      await deleteSpeakerSlidesFile(fileId);

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
         errorMessage: "An unknown error occurred",
      };
   }
}
