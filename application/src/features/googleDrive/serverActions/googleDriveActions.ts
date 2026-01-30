"use server";

import { uploadFileToDrive } from "../services/googleDriveServices";

export async function uploadFileToDriveAction({
   file,
   driveFolderId,
}: {
   file: File;
   driveFolderId: string;
}): Promise<BackendResponse<{ fileId: string }>> {
   try {
      if (!file) {
         return {
            success: false,
            errorMessage: "File is required",
         };
      }

      if (!driveFolderId.trim()) {
         return {
            success: false,
            errorMessage: "Drive folder ID is required",
         };
      }

      const fileId = await uploadFileToDrive({
         file,
         driveFolderId,
      });

      if (!fileId) {
         return {
            success: false,
            errorMessage: "Failed to upload file to Google Drive the id could not be obtained",
         };
      }

      return {
         success: true,
         data: { fileId },
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
         errorMessage: "An unknown error occurred while uploading the file",
      };
   }
}
