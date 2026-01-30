import { google } from "googleapis";

const GOOGLE_OAUTH2_CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID;
const GOOGLE_OAUTH2_CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
const GOOGLE_OAUTH2_REFRESH_TOKEN = process.env.GOOGLE_OAUTH2_REFRESH_TOKEN;

if (!GOOGLE_OAUTH2_CLIENT_ID || !GOOGLE_OAUTH2_CLIENT_SECRET || !GOOGLE_OAUTH2_REFRESH_TOKEN) {
   throw new Error("GOOGLE_OAUTH2_CLIENT_ID or GOOGLE_OAUTH2_CLIENT_SECRET or GOOGLE_OAUTH2_REFRESH_TOKEN is not set");
}

export async function getDriveServerClient() {
   const auth = new google.auth.OAuth2({
      clientId: GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH2_CLIENT_SECRET,
   });

   auth.setCredentials({
      refresh_token: GOOGLE_OAUTH2_REFRESH_TOKEN,
   });

   return google.drive({
      version: "v3",
      auth: auth,
   });
}

export async function getDriveAccessToken() {
   const auth = new google.auth.OAuth2({
      clientId: GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH2_CLIENT_SECRET,
   });

   auth.setCredentials({
      refresh_token: GOOGLE_OAUTH2_REFRESH_TOKEN,
   });

   const accessToken = await auth.getAccessToken();
   if (!accessToken?.token) {
      throw new Error("Failed to obtain Google Drive access token");
   }

   return accessToken.token;
}
