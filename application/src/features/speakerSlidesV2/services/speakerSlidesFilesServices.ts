import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { NewSpeakerSlidesFileData, SpeakerSlidesFile } from "../types/speakerSlidesTypes";

export async function createSpeakerSlidesFileRecord(newSpeakerSlidesFileData: NewSpeakerSlidesFileData) {
   const organization = await getOrganizationFromSubdomain();

   const newSpeakerSlidesFileRecord = await createDBRecord<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", {
      organization: organization.id,
      ...newSpeakerSlidesFileData,
   });

   return newSpeakerSlidesFileRecord;
}

export async function getSpeakerSlidesFileByConferenceId(conferenceId: CongressConferenceRecord["id"]) {
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

   const speakerSlidesFile = await getSingleDBRecord<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", filter);

   return speakerSlidesFile;
}

export async function getAllSpeakerSlidesFilesByCongressId(congressId: CongressRecord["id"]) {
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

   const speakerSlidesFiles = await getFullDBRecordsList<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", {
      filter,
      sort: "-created",
   });

   return speakerSlidesFiles;
}
