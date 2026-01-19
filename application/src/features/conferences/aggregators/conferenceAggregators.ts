import { addSecond } from "@formkit/tempo";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import type { SpeakerDataRecord } from "@/types/congress";
import { getAllProgramConferences } from "../services/conferenceServices";
import type { ConferenceSpeakerPresentationRecording } from "../types/conferenceSpeakerPresentationRecordingTypes";

export interface ConferenceWithSpeakers {
   conference: CongressConferenceRecord;
   speakers: SpeakerDataRecord[];
}

export async function getAllProgramConferencesWithSpeakers(): Promise<
   ConferenceWithSpeakers[]
> {
   const [organization, congress, allProgramConferences] = await Promise.all([
      getOrganizationFromSubdomain(),
      getLatestCongress(),
      getAllProgramConferences(),
   ]);

   const conferenceSpeakersFilter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const expandedConferenceSpeakersRecord = await getFullDBRecordsList<
      ConferenceSpeaker & {
         expand: {
            speaker: SpeakerDataRecord;
         };
      }
   >("CONFERENCE_SPEAKERS", {
      filter: conferenceSpeakersFilter,
      expand: "speaker",
   });

   const conferenceSpeakers = expandedConferenceSpeakersRecord.map(
      (conferenceSpeakerRecord) => ({
         conference: conferenceSpeakerRecord.conference,
         speaker: conferenceSpeakerRecord.expand.speaker,
      }),
   );

   const conferencesWithSpeakers = allProgramConferences.map((conference) => {
      const speakersForThisConference = conferenceSpeakers.filter(
         (conferenceSpeaker) => conferenceSpeaker.conference === conference.id,
      );

      return {
         conference,
         speakers: speakersForThisConference.map(
            (conferenceSpeaker) => conferenceSpeaker.speaker,
         ),
      };
   });

   return conferencesWithSpeakers;
}

export interface ConferenceWithSpeakersAndDurations
   extends ConferenceWithSpeakers {
   preRecordedData?: {
      conferenceRecordingDurationSeconds: number;
      speakerPresentationDurationSeconds: number;
      totalDurationSeconds: number; // duration including speaker presentation duration
      realEndDate: string; // end date including speaker presentation duration
   };
}

export async function getAllProgramConferencesWithSpeakersAndDurations(): Promise<
   ConferenceWithSpeakersAndDurations[]
> {
   const [organization, congress, allProgramConferences] = await Promise.all([
      getOrganizationFromSubdomain(),
      getLatestCongress(),
      getAllProgramConferences(),
   ]);

   const conferenceSpeakersFilter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );
   const conferenceRecordingsFilter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
      `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );
   const conferenceSpeakerPresentationRecordingsFilter = pbFilter(
      `
      organization = {:organizationId} &&
      conference.congress = {:congressId}
      `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const [
      expandedConferenceSpeakersRecord,
      allConferenceRecordings,
      allConferenceSpeakerPresentationRecordings,
   ] = await Promise.all([
      getFullDBRecordsList<
         ConferenceSpeaker & {
            expand: {
               speaker: SpeakerDataRecord;
            };
         }
      >("CONFERENCE_SPEAKERS", {
         filter: conferenceSpeakersFilter,
         expand: "speaker",
      }),
      getFullDBRecordsList<
         ConferenceRecording & {
            expand: {
               recording: SimpleRecordingRecord;
            };
         }
      >("CONFERENCE_RECORDINGS", {
         filter: conferenceRecordingsFilter,
         expand: "recording",
      }),
      getFullDBRecordsList<
         ConferenceSpeakerPresentationRecording & {
            expand: {
               recording: SimpleRecordingRecord;
            };
         }
      >("CONFERENCE_SPEAKER_PRESENTATION_RECORDINGS", {
         filter: conferenceSpeakerPresentationRecordingsFilter,
         expand: "recording",
      }),
   ]);

   const conferenceSpeakers = expandedConferenceSpeakersRecord.map(
      (conferenceSpeakerRecord) => ({
         conference: conferenceSpeakerRecord.conference,
         speaker: conferenceSpeakerRecord.expand.speaker,
      }),
   );

   const conferencesWithSpeakers = allProgramConferences.map((conference) => {
      const speakersForThisConference = conferenceSpeakers.filter(
         (conferenceSpeaker) => conferenceSpeaker.conference === conference.id,
      );

      let preRecordedData: ConferenceWithSpeakersAndDurations["preRecordedData"];
      if (
         conference.conferenceType === "simulated_livestream" ||
         conference.conferenceType === "pre-recorded"
      ) {
         const conferenceRecording = allConferenceRecordings.find(
            (conferenceRecording) =>
               conferenceRecording.conference === conference.id,
         );
         const conferenceSpeakerPresentationRecording =
            allConferenceSpeakerPresentationRecordings.find(
               (conferenceSpeakerPresentationRecording) =>
                  conferenceSpeakerPresentationRecording.conference ===
                  conference.id,
            );

         const conferenceDurationSeconds =
            conferenceRecording?.expand.recording.durationSeconds ?? 0;
         const conferenceSpeakerPresentationDurationSeconds =
            conferenceSpeakerPresentationRecording?.expand.recording
               .durationSeconds ?? 0;
         const totalDurationSeconds =
            conferenceDurationSeconds +
            conferenceSpeakerPresentationDurationSeconds;
         const realEndDate = addSecond(
            conference.startTime,
            totalDurationSeconds,
         );
         preRecordedData = {
            conferenceRecordingDurationSeconds: conferenceDurationSeconds,
            speakerPresentationDurationSeconds:
               conferenceSpeakerPresentationDurationSeconds,
            totalDurationSeconds: totalDurationSeconds,
            realEndDate: realEndDate.toISOString(),
         };
      }

      return {
         conference,
         speakers: speakersForThisConference.map(
            (conferenceSpeaker) => conferenceSpeaker.speaker,
         ),
         preRecordedData,
      };
   });

   return conferencesWithSpeakers;
}
