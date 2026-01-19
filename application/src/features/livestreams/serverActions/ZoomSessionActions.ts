"use server";

import { getZoomSignature } from "@/features/livestreams/services/ZoomSessionServices";

export async function getZoomTokenAction(
   sessionName: string,
   userIdentity: string,
   sessionKey: string,
   role: "participant" | "host" | "manager",
) {
   try {
      const token = await getZoomSignature(
         sessionName,
         userIdentity,
         sessionKey,
         role === "host" ? 1 : 0,
      );
      return {
         success: true,
         token: token,
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
         errorMessage: "Unknown error occurred while getting zoom token",
      };
   }
}
