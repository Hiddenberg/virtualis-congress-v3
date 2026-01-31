import axios, { type AxiosRequestConfig } from "axios";
import { getDriveServerClient } from "@/libs/googleDrive";
import "server-only";
import { Readable } from "node:stream";

/**
 * Creates a fetch-like adapter using axios for the Google Drive API client
 */
function createAxiosFetchAdapter(): typeof fetch {
   return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Convert RequestInfo | URL to string
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      // Convert Headers object to plain object if needed
      const headers: Record<string, string> = {};
      if (init?.headers) {
         if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
               headers[key] = value;
            });
         } else if (Array.isArray(init.headers)) {
            init.headers.forEach(([key, value]) => {
               headers[key] = value;
            });
         } else {
            Object.assign(headers, init.headers);
         }
      }

      const axiosConfig: AxiosRequestConfig = {
         url,
         method: (init?.method as AxiosRequestConfig["method"]) || "GET",
         headers,
         data: init?.body,
         responseType: "arraybuffer",
         validateStatus: () => true, // Don't throw on any status
      };

      try {
         const response = await axios(axiosConfig);

         // Convert axios response to fetch-like Response object
         const responseHeaders = new Headers();
         Object.entries(response.headers).forEach(([key, value]) => {
            if (typeof value === "string") {
               responseHeaders.set(key, value);
            } else if (Array.isArray(value)) {
               responseHeaders.set(key, value.join(", "));
            }
         });

         return new Response(response.data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
         });
      } catch (error) {
         // Handle axios errors
         if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const statusText = error.response?.statusText || "Internal Server Error";
            const headers = new Headers();

            if (error.response?.headers) {
               Object.entries(error.response.headers).forEach(([key, value]) => {
                  if (typeof value === "string") {
                     headers.set(key, value);
                  } else if (Array.isArray(value)) {
                     headers.set(key, value.join(", "));
                  }
               });
            }

            return new Response(error.response?.data || error.message, {
               status,
               statusText,
               headers,
            });
         }

         throw error;
      }
   };
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

export async function uploadFileToDriveWithClient({ file, driveFolderId }: { file: File; driveFolderId: string }) {
   const drive = await getDriveServerClient();

   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer);

   const result = await drive.files.create(
      {
         requestBody: {
            name: file.name,
            parents: [driveFolderId],
         },
         media: {
            mimeType: file.type || "application/octet-stream",
            body: Readable.from(buffer),
         },
      },
      {
         fetchImplementation: createAxiosFetchAdapter(),
      },
   );

   return result.data?.id as string | undefined;
}
