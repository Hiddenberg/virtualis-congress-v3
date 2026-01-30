import { getDriveServerClient } from "@/libs/googleDrive";
import "server-only";

/**
 * Lists the names and IDs of up to 10 files.
 */
export async function listDriveFiles() {
   // Authenticate with Google and get an authorized client.
   const drive = await getDriveServerClient();

   // Create a new Drive API client.
   // Get the list of files.
   const result = await drive.files.list({
      pageSize: 10,
   });
   const files = result.data.files;
   if (!files || files.length === 0) {
      console.log("No files found.");
      return;
   }

   console.log("Files:");
   // Print the name and ID of each file.
   return files;
}

export async function uploadFileToDrive({ file, driveFolderId }: { file: File; driveFolderId: string }) {
   const drive = await getDriveServerClient();

   const result = await drive.files.create({
      requestBody: {
         name: file.name,
         parents: [driveFolderId],
      },
   });

   console.log("result", result);

   return result.data.id;
}
