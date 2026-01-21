import { NextResponse } from "next/server";
import { getFullDBRecordsList } from "@/libs/pbServerClientNew";

export async function GET() {
   const conferenceLivestreams = await getFullDBRecordsList<
      ConferenceLivestream & {
         expand: {
            livestreamSession: LivestreamSessionRecord & {
               expand: {
                  livestream__mux_livestream_via_livestreamSession: LivestreamMuxAssetRecord[];
               };
            };
            conference: CongressConferenceRecord;
         };
      }
   >("CONFERENCE_LIVESTREAMS", {
      expand: "livestreamSession, conference, livestreamSession.livestream__mux_livestream_via_livestreamSession",
   });
   return NextResponse.json({
      conferenceLivestreams: conferenceLivestreams[0],
   });
}
