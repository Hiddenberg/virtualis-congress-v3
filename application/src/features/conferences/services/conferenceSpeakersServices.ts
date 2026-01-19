import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";
import type { SpeakerDataRecord } from "@/types/congress";
import "server-only";

export async function linkSpeakerToConference({
   speakerId,
   conferenceId,
}: {
   speakerId: SpeakerDataRecord["id"];
   conferenceId: CongressConferenceRecord["id"];
}): Promise<ConferenceSpeakerRecord> {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const conferenceSpeakerRecord = await createDBRecord<ConferenceSpeaker>(
      "CONFERENCE_SPEAKERS",
      {
         organization: organization.id,
         congress: congress.id,
         conference: conferenceId,
         speaker: speakerId,
      },
   );

   return conferenceSpeakerRecord;
}

export async function getConferenceSpeakers(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      conference = {:conferenceId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
         conferenceId,
      },
   );

   const conferenceSpeakers = await getFullDBRecordsList<
      ConferenceSpeaker & {
         expand: {
            speaker: SpeakerDataRecord;
         };
      }
   >("CONFERENCE_SPEAKERS", {
      filter,
      expand: "speaker",
   });

   return conferenceSpeakers.map(
      (conferenceSpeaker) => conferenceSpeaker.expand.speaker,
   );
}

export async function unlinkSpeakerFromConference({
   speakerId,
   conferenceId,
}: {
   speakerId: SpeakerDataRecord["id"];
   conferenceId: CongressConferenceRecord["id"];
}) {
   const link = await getSingleDBRecord<ConferenceSpeaker>(
      "CONFERENCE_SPEAKERS",
      `speaker = "${speakerId}" && conference = "${conferenceId}"`,
   );
   if (!link) return null;
   await deleteDBRecord("CONFERENCE_SPEAKERS", link.id);
   return null;
}
