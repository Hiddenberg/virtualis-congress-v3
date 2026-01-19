"use server";

import { ClientResponseError, type RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import type { ACPMemberData } from "@/types/congress";

export async function getACPMemberDataAction(acpID: string) {
   console.log("getACPMemberDataAction", acpID);
   try {
      const filter = acpID.startsWith("0")
         ? `(acpID = "${acpID}") || (acpID = "${acpID.replace("0", "")}")`
         : `acpID = "${acpID}"`;
      const acpData = await pbServerClient
         .collection("acp_members_data")
         .getFirstListItem<RecordModel & ACPMemberData>(filter);

      return acpData;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}
