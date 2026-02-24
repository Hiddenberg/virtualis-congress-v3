import { NextResponse } from "next/server";
import { getAllCongressConferences } from "@/features/conferences/services/conferenceServices";
import type { CongressConferenceRecord } from "@/features/conferences/types/conferenceTypes";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export async function GET(): Promise<NextResponse<BackendResponse<{ conferences: CongressConferenceRecord[] }>>> {
   const congress = await getLatestCongress();
   const allCongressConferences = await getAllCongressConferences(congress.id);

   return NextResponse.json({
      success: true,
      data: {
         conferences: allCongressConferences,
      },
   });
}
