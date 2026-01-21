import { NextResponse } from "next/server";
import type { RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import pbServerClient from "@/libs/pbServerClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";

export async function GET() {
   const conferences = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
      .getFullList<CongressConference & RecordModel>({
         filter: `congress = "${TEMP_CONSTANTS.CONGRESS_ID}"`,
      });

   const conferencesUpdated = [];
   const conferencesSkipped = [];

   for (const conference of conferences) {
      if (conference.status !== "finished") {
         await pbServerClient.collection(PB_COLLECTIONS.CONGRESS_CONFERENCES).update(conference.id, {
            status: "finished",
         } satisfies Partial<CongressConference>);
         conferencesUpdated.push(conference.id);
      } else {
         conferencesSkipped.push(conference.id);
      }
   }
   return NextResponse.json({
      conferencesUpdated,
      conferencesSkipped,
      conferencesUpdatedCount: conferencesUpdated.length,
      conferencesSkippedCount: conferencesSkipped.length,
   });
}
