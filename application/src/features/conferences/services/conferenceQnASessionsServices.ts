import "server-only";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import {
   createLivestreamSession,
   deleteLivestreamSessionResources,
} from "@/features/livestreams/services/livestreamSessionServices";
import { createMuxLivestream } from "@/features/livestreams/services/muxLivestreamServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";

export async function getConferenceQnASession(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const link = await getSingleDBRecord<
      ConferenceQnASessionRecord & {
         expand: { livestreamSession: LivestreamSessionRecord };
      }
   >(
      "CONFERENCE_QNA_SESSIONS",
      pbFilter(
         `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId}`,
         {
            organizationId: organization.id,
            congressId: congress.id,
            conferenceId,
         },
      ),
      {
         expand: "livestreamSession",
      },
   );

   return link?.expand.livestreamSession ?? null;
}

export async function ensureConferenceQnASession(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const existing = await getConferenceQnASession(conferenceId);
   if (existing) return existing;

   const livestreamSession = await createLivestreamSession();
   await createMuxLivestream(livestreamSession.id);

   await createDBRecord<ConferenceQnASession>("CONFERENCE_QNA_SESSIONS", {
      organization: organization.id,
      congress: congress.id,
      conference: conferenceId,
      livestreamSession: livestreamSession.id,
   });

   return livestreamSession;
}

export async function removeConferenceQnASession(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const conferenceQnaSessionRecord = await getSingleDBRecord<
      ConferenceQnASessionRecord & {
         expand: { livestreamSession: LivestreamSessionRecord };
      }
   >(
      "CONFERENCE_QNA_SESSIONS",
      pbFilter(
         `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId}`,
         {
            organizationId: organization.id,
            congressId: congress.id,
            conferenceId,
         },
      ),
      {
         expand: "livestreamSession",
      },
   );

   if (!conferenceQnaSessionRecord) return null;

   const livestreamId = conferenceQnaSessionRecord.expand.livestreamSession.id;
   await deleteLivestreamSessionResources(livestreamId); // Also deletes the DB record for the conference QnA session

   return null;
}
