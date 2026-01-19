import { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface ConferenceSpeakerPresentationRecording {
   organization: OrganizationRecord["id"];
   conference: CongressConferenceRecord["id"];
   recording: SimpleRecordingRecord["id"];
}
export type ConferenceSpeakerPresentationRecordingRecord =
   DBRecordItem<ConferenceSpeakerPresentationRecording>;
