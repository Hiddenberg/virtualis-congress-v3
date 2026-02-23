import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import { createDBRecord, deleteDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import type { ConferenceSpeakerPresentationRecording } from "../types/conferenceSpeakerPresentationRecordingTypes";

export async function linkSpeakerPresentationRecordingToConference({
   conferenceId,
   recordingId,
}: {
   conferenceId: CongressConferenceRecord["id"];
   recordingId: SimpleRecordingRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();

   const speakerPresentationRecording = await createDBRecord<ConferenceSpeakerPresentationRecording>(
      "CONFERENCE_SPEAKER_PRESENTATION_RECORDINGS",
      {
         organization: organization.id,
         conference: conferenceId,
         recording: recordingId,
      },
   );

   return speakerPresentationRecording;
}

export async function getSpeakerPresentationRecordingByConferenceId(conferenceId: CongressConferenceRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      conference = {:conferenceId}
      `,
      {
         organizationId: organization.id,
         conferenceId,
      },
   );

   const speakerPresentationRecording = await getSingleDBRecord<
      ConferenceSpeakerPresentationRecording & {
         expand: {
            recording: SimpleRecordingRecord;
         };
      }
   >("CONFERENCE_SPEAKER_PRESENTATION_RECORDINGS", filter, {
      expand: "recording",
   });

   return speakerPresentationRecording?.expand.recording ?? null;
}

export async function unlinkSpeakerPresentationRecordingFromConference({
   conferenceId,
}: {
   conferenceId: CongressConferenceRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      conference = {:conferenceId}
      `,
      {
         organizationId: organization.id,
         conferenceId,
      },
   );

   const speakerPresentationRecording = await getSingleDBRecord<ConferenceSpeakerPresentationRecording>(
      "CONFERENCE_SPEAKER_PRESENTATION_RECORDINGS",
      filter,
   );

   if (!speakerPresentationRecording) return null;
   await deleteDBRecord("CONFERENCE_SPEAKER_PRESENTATION_RECORDINGS", speakerPresentationRecording.id);
   return null;
}
