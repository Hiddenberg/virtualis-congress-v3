import process from "node:process";
import { google } from "googleapis";

// The scope for reading file metadata.
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
   throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set");
}

async function getDriveServerClient() {
   const auth = new google.auth.GoogleAuth({
      credentials: {
         client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
         private_key: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: SCOPES,
   });

   return google.drive({
      version: "v3",
      auth: auth,
   });
}

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
