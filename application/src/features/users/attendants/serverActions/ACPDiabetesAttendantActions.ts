"use server";

import { getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import type { ACPMemberData } from "@/types/congress";

export async function validateACPIDAction({ acpID }: { acpID: string }): Promise<BackendResponse<{ isValid: boolean }>> {
   try {
      const normalizedACPID = acpID.startsWith("0") ? acpID.replace("0", "") : acpID;

      const filter = pbFilter(
         `
         acpID = {:acpID}
         `,
         {
            acpID: normalizedACPID,
         },
      );

      const acpData = await getSingleDBRecord<ACPMemberData>("ACP_MEMBERS_DATA", filter);
      // TODO: Add action to validate acp id
      return {
         success: true,
         data: {
            isValid: acpData ? true : false,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      console.error("[validateACPIDAction] An unknown error occurred:", error);
      return {
         success: false,
         errorMessage: "[validateACPIDAction] An unknown error occurred",
      };
   }
}
