import { Readable } from "node:stream";
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

export async function uploadFileToDrive({ file }: { file: File }) {
   const drive = await getDriveServerClient();

   const driveFolderId = "19siBoAY6IQJfr1OEFOsZRWFkdqyjcWzn";

   // Check if the service account has access to the drive folder
   const driveFolder = await drive.files.get({
      fileId: driveFolderId,
      fields: "id, name, capabilities",
   });
   if (!driveFolder) {
      throw new Error("Drive folder not found");
   }

   console.log("driveFolder", driveFolder.data);

   // 1. Obtener el buffer del archivo
   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);

   // 2. Crear un Stream compatible con la librería de Google
   // Importante: No uses readableStream.push(), usa Readable.from()
   const mediaStream = Readable.from(buffer);

   const result = await drive.files.create({
      requestBody: {
         name: file.name,
         parents: [driveFolderId],
      },
      media: {
         body: mediaStream, // Ahora es un stream real de Node.js
      },
   });

   return result.data.id;
}
