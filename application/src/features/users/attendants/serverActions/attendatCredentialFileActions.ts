"use server";

import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { createOrUpdateAttendantCredentialFile } from "../services/attendantCredentialFilesServices";

export async function uploadAttendantCredentialFileAction({
   fileType,
   file,
}: {
   fileType: string;
   file: File;
}): Promise<BackendResponse<AttendantCredentialFileRecord>> {
   try {
      const userId = await getLoggedInUserId();
      if (!userId) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }

      const attendantCredentialFile = await createOrUpdateAttendantCredentialFile({
         userId,
         fileType,
         file,
      });

      return {
         success: true,
         data: attendantCredentialFile,
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
