import "server-only";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { createLivestreamSession } from "@/features/livestreams/services/livestreamSessionServices";
import { createMuxLivestream } from "@/features/livestreams/services/muxLivestreamServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";

export async function getConferenceLivestreamSession(conferenceId: CongressConferenceRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const link = await getSingleDBRecord<
      ConferenceLivestreamRecord & {
         expand: { livestreamSession: LivestreamSessionRecord };
      }
   >(
      "CONFERENCE_LIVESTREAMS",
      pbFilter(`organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId}`, {
         organizationId: organization.id,
         congressId: congress.id,
         conferenceId,
      }),
      {
         expand: "livestreamSession",
      },
   );

   return link?.expand.livestreamSession ?? null;
}

export async function ensureConferenceLivestream(conferenceId: CongressConferenceRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const existing = await getConferenceLivestreamSession(conferenceId);

   if (existing) return existing;

   const livestreamSession = await createLivestreamSession();
   await createMuxLivestream(livestreamSession.id);

   // Link the livestream session to the conference
   await createDBRecord<ConferenceLivestream>("CONFERENCE_LIVESTREAMS", {
      organization: organization.id,
      congress: congress.id,
      conference: conferenceId,
      livestreamSession: livestreamSession.id,
   });

   return livestreamSession;
}
