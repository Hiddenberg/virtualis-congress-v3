import { createLivestreamSession } from "@/features/livestreams/services/livestreamSessionServices";
import { createMuxLivestream } from "@/features/livestreams/services/muxLivestreamServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";

export async function createRecordingLivestream(simpleRecordingId: SimpleRecordingRecord["id"]) {
   const livestreamSession = await createLivestreamSession();
   await createMuxLivestream(livestreamSession.id);

   const recordingLivestream = await createDBRecord<SimpleRecordingLivestream>("SIMPLE_RECORDING_LIVESTREAMS", {
      organization: livestreamSession.organization,
      livestreamSession: livestreamSession.id,
      recording: simpleRecordingId,
   });

   return recordingLivestream;
}

export async function getRecordingLivestreamSessionByRecordingId(recordingId: SimpleRecordingRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      recording = {:recordingId}
   `,
      {
         organizationId: organization.id,
         recordingId,
      },
   );

   const recordingLivestream = await getSingleDBRecord<
      SimpleRecordingLivestream & {
         expand: {
            livestreamSession: LivestreamSessionRecord;
         };
      }
   >("SIMPLE_RECORDING_LIVESTREAMS", filter, {
      expand: "livestreamSession",
   });

   return recordingLivestream?.expand.livestreamSession ?? null;
}

export async function getRecordingLivestreamRecordByLivestreamSessionId({
   organizationId,
   livestreamSessionId,
}: {
   organizationId: string;
   livestreamSessionId: string;
}) {
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      livestreamSession = {:livestreamSessionId}
   `,
      {
         organizationId,
         livestreamSessionId,
      },
   );

   const recordingLivestream = await getSingleDBRecord<SimpleRecordingLivestream>("SIMPLE_RECORDING_LIVESTREAMS", filter);

   return recordingLivestream;
}
