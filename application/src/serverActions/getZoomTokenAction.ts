"use server";

import { getZoomSignature } from "@/services/zoomSignatureService";

export async function getZoomTokenAction(
   sessionName: string,
   userIdentity: string,
   sessionKey: string,
   role: "participant" | "host" | "manager",
) {
   try {
      const token = await getZoomSignature(sessionName, userIdentity, sessionKey, role === "host" ? 1 : 0);
      return {
         success: true,
         token: token,
      };
   } catch (error) {
      return {
         success: false,
         error: error,
      };
   }
}
