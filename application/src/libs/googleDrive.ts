import process from "node:process";
import { google } from "googleapis";

// The scope for reading file metadata.
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
   throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set");
}

export async function getDriveServerClient() {
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
