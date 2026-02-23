import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface SimpleRecording {
   organization: OrganizationRecord["id"];
   campaign: SimpleRecordingCampaignRecord["id"];
   title: string;
   recorderName?: string;
   recorderEmail?: string;
   status: "scheduled" | "recording" | "uploading" | "reviewing" | "processing" | "ready" | "error";
   invitationEmailStatus: "not_sent" | "sent" | "opened" | "error";
   recordingType: "only_camera" | "camera_and_presentation";
   invitationEmailOpenedAt?: string;
   muxAssetId?: string;
   muxPlaybackId?: string;
   muxDownloadURL?: string;
   errorMessage?: string;
   durationSeconds: number;
   manuallyContacted?: boolean;
}
export type SimpleRecordingRecord = DBRecordItem<SimpleRecording>;

export interface SimpleRecordingCampaign {
   organization: OrganizationRecord["id"];
   title: string;
   description?: string;
}
export type SimpleRecordingCampaignRecord = DBRecordItem<SimpleRecordingCampaign>;

export interface SimpleRecordingLivestream {
   organization: OrganizationRecord["id"];
   livestreamSession: LivestreamSessionRecord["id"];
   recording: SimpleRecordingRecord["id"];
}

export type SimpleRecordingLivestreamRecord = DBRecordItem<SimpleRecordingLivestream>;
