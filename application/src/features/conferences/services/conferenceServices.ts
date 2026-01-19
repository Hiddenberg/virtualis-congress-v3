import { dayEnd, dayStart } from "@formkit/tempo";
import { ClientResponseError, RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import pbServerClient from "@/libs/pbServerClient";
import {
   createDBRecord,
   deleteDBRecord,
   getDBRecordById,
   getFullDBRecordsList,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { getAllCongressRecordings } from "../../../services/recordingServices";
import { getAllSpeakerPhoneNumbers } from "../../users/speakers/services/speakerServices";

export type NewConferenceData = Omit<
   CongressConference,
   "organization" | "congress" | "status"
>;
export async function createConference({
   title,
   shortDescription,
   startTime,
   endTime,
   conferenceType,
}: NewConferenceData) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();
   const newConference: CongressConference = {
      organization: organization.id,
      congress: congress.id,
      title,
      shortDescription,
      startTime: startTime,
      endTime: endTime,
      conferenceType,
      status: "scheduled",
   };

   const conferenceCreated = await createDBRecord<CongressConference>(
      "CONGRESS_CONFERENCES",
      newConference,
   );

   console.log("conference created");
   return conferenceCreated;
}

export async function getConferenceById(conferenceId: string) {
   const conference = await getDBRecordById<CongressConference>(
      "CONGRESS_CONFERENCES",
      conferenceId,
   );
   return conference;
}

export interface ConferenceWithSpeakerNamesAndPhones
   extends CongressConference,
      RecordModel {
   speakersDetails: {
      name: User["name"];
      phone: string | undefined;
      email: string;
   }[];
   presenterDetails?: {
      name: User["name"];
      phone: string | undefined;
      email: string;
   };
}
export async function getAllCongressConferencesByDate(
   congressId: string,
   date: Date,
) {
   const startOfTheDay = dayStart(date).toISOString().replace("T", " ");
   const endOfTheDay = dayEnd(date).toISOString().replace("T", " ");

   const filter = `congress = "${congressId}" && startTime >= "${startOfTheDay}" && endTime <= "${endOfTheDay}"`;
   try {
      const conferences = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
         .getFullList<
            CongressConference &
               RecordModel & {
                  expand: {
                     speakers: (RecordModel & User)[];
                     presenter: RecordModel & User;
                  };
               }
         >({
            filter,
            expand: "speakers, presenter",
         });

      const speakerPhones = await getAllSpeakerPhoneNumbers();

      const conferencesDetails: ConferenceWithSpeakerNamesAndPhones[] =
         conferences.map((conference) => ({
            ...conference,
            speakersDetails: conference.expand.speakers.map((speaker) => {
               const speakerPhone = speakerPhones.find(
                  (phone) => phone.userId === speaker.id,
               )?.phoneNumber;
               return {
                  name: speaker.name,
                  phone: speakerPhone,
                  email: speaker.email,
               };
            }),
            presenterDetails: {
               name: conference.expand.presenter?.name,
               phone: speakerPhones.find(
                  (phone) => phone.userId === conference.expand.presenter?.id,
               )?.phoneNumber,
               email: conference.expand.presenter?.email,
            },
            expand: undefined,
         }));

      return conferencesDetails;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return [];
      }
      throw error;
   }
}

export async function getAllProgramConferences() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   // Don't include conferences that start with "!!"
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      title !~ "[prueba]" &&
      congress = {:congressId}
      `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );
   const allProgramConferences = await getFullDBRecordsList<CongressConference>(
      "CONGRESS_CONFERENCES",
      {
         filter,
      },
   );
   return allProgramConferences;
}

export async function getAllCongressConferences(congressId: string) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
      `,
      {
         organizationId: organization.id,
         congressId,
      },
   );
   const allCongressConferences =
      await getFullDBRecordsList<CongressConference>("CONGRESS_CONFERENCES", {
         filter,
         sort: "startTime",
      });

   return allCongressConferences;
}

export async function getIndividualConferencesWithSpeakerEmails(
   congressId: string,
) {
   const filter = `congress = "${congressId}" && conferenceType = "individual"`;
   const expandedIndividualConferences = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
      .getFullList<
         CongressConference &
            RecordModel & { expand: { speakers: (RecordModel & User)[] } }
      >({
         filter,
         expand: "speakers",
      });

   const conferencesDetails = expandedIndividualConferences.map(
      (conference) => ({
         ...conference,
         speakerDetails: {
            name: conference.expand.speakers[0].name,
            email: conference.expand.speakers[0].email,
         },
         expand: undefined,
      }),
   );

   return conferencesDetails;
}

export interface ExpandedConference extends CongressConference, RecordModel {
   expand: {
      speakers: (RecordModel & User)[];
      presenter: RecordModel & User;
   };
}
export async function getExpandedConferenceById(conferenceId: string) {
   try {
      const expandedConference = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCES)
         .getFirstListItem<ExpandedConference>(`id = "${conferenceId}"`, {
            expand: "speakers, presenter",
         });

      return expandedConference;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function updateConference(
   conferenceId: string,
   data: Partial<CongressConference>,
) {
   const conference = await getDBRecordById<CongressConference>(
      "CONGRESS_CONFERENCES",
      conferenceId,
   );
   if (!conference) {
      throw new Error("Conference not found");
   }

   const updatedConference = await updateDBRecord<CongressConference>(
      "CONGRESS_CONFERENCES",
      conferenceId,
      data,
   );
   return updatedConference;
}

export async function deleteConferenceRecord(conferenceId: string) {
   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      throw new Error("Conference not found or already deleted");
   }

   await deleteDBRecord("CONGRESS_CONFERENCES", conferenceId);
   console.log(`${conference.title}, id: ${conferenceId} deleted`);
}

export async function getConferencesStatus() {
   const allRecordings = await getAllCongressRecordings(
      TEMP_CONSTANTS.CONGRESS_ID,
   );

   const allConferenceRecordings = allRecordings.filter(
      (recording) =>
         recording.recordingType === "conference" ||
         recording.recordingType === "group_conference",
   );
   const allPresentationRecordings = allRecordings.filter(
      (recording) => recording.recordingType === "presentation",
   );

   const totalConferences = allConferenceRecordings.length;
   const totalPresentations = allPresentationRecordings.length;

   const pendingConferences = allConferenceRecordings.filter(
      (recording) => recording.status === "pending",
   ).length;
   const pendingPresentations = allPresentationRecordings.filter(
      (recording) => recording.status === "pending",
   ).length;

   const recordedConferences = allConferenceRecordings.filter(
      (recording) => recording.status === "available",
   ).length;
   const recordedPresentations = allPresentationRecordings.filter(
      (recording) => recording.status === "available",
   ).length;

   const results = {
      pendingConferences,
      pendingPresentations,
      totalConferences,
      totalPresentations,
      recordedConferences,
      recordedPresentations,
   };

   return results;
}
