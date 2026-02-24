import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { SimpleRecordingRecord } from "@/features/simpleRecordings/types/recordingsTypes";
import type { CongressConferenceRecord } from "./conferenceTypes";

export interface ConferenceSpeakerPresentationRecording {
   organization: OrganizationRecord["id"];
   conference: CongressConferenceRecord["id"];
   recording: SimpleRecordingRecord["id"];
}
export type ConferenceSpeakerPresentationRecordingRecord = DBRecordItem<ConferenceSpeakerPresentationRecording>;
