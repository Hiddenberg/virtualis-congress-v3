import { ClientResponseError, type RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import type { SpeakerData, SpeakerDataRecord } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";

export async function getSpeakerDataByUserId(userId: string) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
         userId,
      },
   );

   const speakerData = await getSingleDBRecord<SpeakerData>("SPEAKERS_DATA", filter);

   return speakerData;
}

export async function getAllSpeakersDetails() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const expandedSpeakers = await getFullDBRecordsList<
      SpeakerData & {
         expand: {
            user?: UserRecord;
         };
      }
   >("SPEAKERS_DATA", {
      filter,
      expand: "user",
   });

   const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
   const speakerDetails = expandedSpeakers.map((expandedSpeaker) => ({
      name: expandedSpeaker.displayName,
      email: expandedSpeaker.expand.user?.email || undefined,
      bio: expandedSpeaker.bio,
      academicTitle: expandedSpeaker.academicTitle,
      specialityDetails: expandedSpeaker.specialityDetails,
      presentationPhotoUrl:
         typeof expandedSpeaker.presentationPhoto === "string"
            ? `${pbUrl}/api/files/${expandedSpeaker.collectionId}/${expandedSpeaker.id}/${expandedSpeaker.presentationPhoto}`
            : undefined,
   }));

   return speakerDetails;
}

export async function getAllSpeakerNamesAndIds() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const speakers = await getFullDBRecordsList<SpeakerData>("SPEAKERS_DATA", {
      filter,
      sort: "displayName",
   });

   return speakers.map((speaker) => ({
      id: speaker.id,
      name: speaker.displayName,
   }));
}

export async function getSpeakerNameById(speakerId: string) {
   const speakerName = await pbServerClient
      .collection(PB_COLLECTIONS.SPEAKERS_DATA)
      .getOne<SpeakerData & RecordModel & { expand: { user: User } }>(speakerId, {
         expand: "user",
         fields: "expand.user.name",
      });

   return speakerName.expand.user.name;
}

export async function getSpeakerAcademicTitleByUserId(userId: string) {
   try {
      const speakerData = await pbServerClient
         .collection(PB_COLLECTIONS.SPEAKERS_DATA)
         .getFirstListItem<{ academicTitle: SpeakerData["academicTitle"] }>(`user = "${userId}"`, {
            fields: "academicTitle",
         });

      return speakerData.academicTitle || "";
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return "";
      }

      throw error;
   }
}

export async function getExpandedSpeakerByUserId(userId: string) {
   try {
      const speakerData = await pbServerClient
         .collection(PB_COLLECTIONS.SPEAKERS_DATA)
         .getFirstListItem<SpeakerData & RecordModel & { expand: { user: User & RecordModel } }>(`user = "${userId}"`, {
            expand: "user",
         });

      return speakerData;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         throw new Error("Speaker not found");
      }

      throw error;
   }
}

export interface NewSpeakerData {
   name: string;
   email?: string;
   phoneNumber?: string;
   academicTitle?: SpeakerData["academicTitle"];
   specialityDetails?: SpeakerData["specialityDetails"];
   bio?: SpeakerData["bio"];
   presentationPhoto?: File;
}
export async function createSpeakerDataRecord({
   speakerRegistrationInfo,
   organizationId,
   congressId,
   userId,
}: {
   speakerRegistrationInfo: NewSpeakerData;
   organizationId: string;
   congressId: string;
   userId?: string;
}) {
   const newSpeakerData: SpeakerData = {
      organization: organizationId,
      user: userId,
      congress: congressId,
      displayName: speakerRegistrationInfo.name,
      academicTitle: speakerRegistrationInfo.academicTitle,
      specialityDetails: speakerRegistrationInfo.specialityDetails,
      bio: speakerRegistrationInfo.bio,
      presentationPhoto: speakerRegistrationInfo.presentationPhoto,
   };

   const newSpeaker = await createDBRecord<SpeakerData>("SPEAKERS_DATA", newSpeakerData);

   return newSpeaker;
}

export async function linkSpeakerAccount(userId: UserRecord["id"], speakerDataId: SpeakerDataRecord["id"]) {
   const updatedSpeakerData = await updateDBRecord<SpeakerData>("SPEAKERS_DATA", speakerDataId, {
      user: userId,
   });

   return updatedSpeakerData;
}

export async function getAllSpeakerPhoneNumbers() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );

   const speakers = await getFullDBRecordsList<SpeakerData & { expand: { user: UserRecord } }>("SPEAKERS_DATA", {
      filter,
      expand: "user",
   });

   return speakers.map((speaker) => ({
      userId: speaker.expand.user.id,
      phoneNumber: speaker.expand.user.phoneNumber,
   }));
}
