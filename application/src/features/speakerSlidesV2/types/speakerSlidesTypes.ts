import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface SpeakerSlidesFile {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: CongressConferenceRecord["id"];
   fileName: string;
   fileSizeInMb: number;
   googleDriveFolderId: string;
   googleDriveFileId: string;
}

export type SpeakerSlidesFileRecord = DBRecordItem<SpeakerSlidesFile>;
export type NewSpeakerSlidesFileData = Omit<SpeakerSlidesFile, "organization">;
