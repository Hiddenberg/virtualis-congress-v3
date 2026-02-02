import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, deleteDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import { IS_DEV_ENVIRONMENT } from "@/data/constants/platformConstants";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import { deleteFileFromDrive, uploadFileToDriveWithClient } from "@/features/googleDrive/services/googleDriveServices";
import type { NewSpeakerSlidesFileData, SpeakerSlidesFile, SpeakerSlidesFileRecord } from "../types/speakerSlidesTypes";

export async function createSpeakerSlidesFileRecord(newSpeakerSlidesFileData: NewSpeakerSlidesFileData) {
   const organization = await getOrganizationFromSubdomain();

   const newSpeakerSlidesFileRecord = await createDBRecord<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", {
      organization: organization.id,
      ...newSpeakerSlidesFileData,
   });

   return newSpeakerSlidesFileRecord;
}

export async function getSpeakerSlidesFileRecord(speakerSlidesFileId: SpeakerSlidesFileRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:speakerSlidesFileId}
   `,
      {
         organizationId: organization.id,
         speakerSlidesFileId,
      },
   );
   const speakerSlidesFile = await getSingleDBRecord<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", filter);

   return speakerSlidesFile;
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

export async function getSpeakerSlidesFilesByConferenceId(conferenceId: CongressConferenceRecord["id"]) {
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

   const speakerSlidesFiles = await getFullDBRecordsList<SpeakerSlidesFile>("SPEAKER_SLIDES_FILES", {
      filter,
      sort: "-created",
   });

   return speakerSlidesFiles;
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

export async function uploadSpeakerSlidesFile({
   fileName,
   conferenceId,
   file,
}: {
   fileName: string;
   conferenceId: CongressConferenceRecord["id"];
   file: File;
}) {
   const conference = await getConferenceById(conferenceId);
   if (!conference) {
      throw new Error("Conference not found");
   }

   const driveFolderId = IS_DEV_ENVIRONMENT ? "1VTNEIDrISs5pdqKfqDkY4F69G3nLkF2w" : "19siBoAY6IQJfr1OEFOsZRWFkdqyjcWzn";

   const driveFileId = await uploadFileToDriveWithClient({
      file,
      driveFolderId,
   });

   const fileSizeInMb = Number((file.size / 1024 / 1024).toFixed(2));

   const speakerSlidesFile = await createSpeakerSlidesFileRecord({
      conference: conference.id,
      congress: conference.congress,
      fileName,
      fileSizeInMb,
      googleDriveFolderId: driveFolderId,
      googleDriveFileId: driveFileId,
   });

   return speakerSlidesFile;
}

export async function deleteSpeakerSlidesFile(speakerSlidesFileId: SpeakerSlidesFileRecord["id"]) {
   const speakerSlidesFile = await getSpeakerSlidesFileRecord(speakerSlidesFileId);
   if (!speakerSlidesFile) {
      throw new Error("Speaker slides file not found");
   }

   await deleteFileFromDrive(speakerSlidesFile.googleDriveFileId);
   await deleteDBRecord("SPEAKER_SLIDES_FILES", speakerSlidesFileId);
}
