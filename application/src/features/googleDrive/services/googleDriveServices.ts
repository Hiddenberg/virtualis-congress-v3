import { randomUUID } from "node:crypto";
import axios from "axios";
import { getDriveAccessToken, getDriveServerClient } from "@/libs/googleDrive";
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
   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);

   const accessToken = await getDriveAccessToken();
   const boundary = `upload_${randomUUID()}`;
   const metadata = {
      name: file.name,
      parents: [driveFolderId],
   };
   const fileMimeType = file.type || "application/octet-stream";

   const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from("Content-Type: application/json; charset=UTF-8\r\n\r\n"),
      Buffer.from(`${JSON.stringify(metadata)}\r\n`),
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Type: ${fileMimeType}\r\n\r\n`),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`),
   ]);

   const response = await axios.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", multipartBody, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
         "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      maxBodyLength: Number.POSITIVE_INFINITY,
      maxContentLength: Number.POSITIVE_INFINITY,
   });

   console.log("response", response.data);

   return response.data?.id as string | undefined;
}
