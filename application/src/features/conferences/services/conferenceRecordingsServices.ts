import "server-only";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
} from "@/libs/pbServerClientNew";

export async function linkRecordingToConference({
   conferenceId,
   recordingId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   recordingId: SimpleRecordingRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const existing = await getSingleDBRecord<ConferenceRecordingRecord>(
      "CONFERENCE_RECORDINGS",
      pbFilter(
         `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId} && recording = {:recordingId}`,
         {
            organizationId: organization.id,
            congressId: congress.id,
            conferenceId,
            recordingId,
         },
      ),
   );
   if (existing) return existing;

   // enforce only-one recording per conference: remove any existing link for this conference
   const previous = await getSingleDBRecord<ConferenceRecordingRecord>(
      "CONFERENCE_RECORDINGS",
      pbFilter(
         `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId}`,
         {
            organizationId: organization.id,
            congressId: congress.id,
            conferenceId,
         },
      ),
   );
   if (previous) {
      await deleteDBRecord("CONFERENCE_RECORDINGS", previous.id);
   }

   const created = await createDBRecord<ConferenceRecording>(
      "CONFERENCE_RECORDINGS",
      {
         organization: organization.id,
         congress: congress.id,
         conference: conferenceId,
         recording: recordingId,
      },
   );

   return created;
}

export async function unlinkRecordingFromConference(
   conferenceId: CongressConferenceRecord["id"],
   recordingId: SimpleRecordingRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const link = await getSingleDBRecord<ConferenceRecordingRecord>(
      "CONFERENCE_RECORDINGS",
      pbFilter(
         `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId} && recording = {:recordingId}`,
         {
            organizationId: organization.id,
            congressId: congress.id,
            conferenceId,
            recordingId,
         },
      ),
   );
   if (!link) return null;
   await deleteDBRecord("CONFERENCE_RECORDINGS", link.id);
   return null;
}

export async function getConferenceRecordings(
   conferenceId: CongressConferenceRecord["id"],
) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `organization = {:organizationId} && congress = {:congressId} && conference = {:conferenceId}`,
      {
         organizationId: organization.id,
         congressId: congress.id,
         conferenceId,
      },
   );

   const records = await getFullDBRecordsList<
      ConferenceRecordingRecord & {
         expand: { recording: SimpleRecordingRecord };
      }
   >("CONFERENCE_RECORDINGS", {
      filter,
      expand: "recording",
      sort: "-created",
   });

   return records.map((r) => r.expand.recording);
}

export async function getConferenceRecording(
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

   const record = await getSingleDBRecord<
      ConferenceRecordingRecord & {
         expand: { recording: SimpleRecordingRecord };
      }
   >("CONFERENCE_RECORDINGS", filter, {
      expand: "recording",
   });

   return record?.expand.recording ?? null;
}
