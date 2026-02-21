interface SimpleRecording {
   organization: OrganizationRecord["id"];
   campaign: SimpleRecordingCampaign["id"];
   title: string;
   recorderName: string;
   recorderEmail: string;
   status:
      | "scheduled"
      | "recording"
      | "uploading"
      | "reviewing"
      | "processing"
      | "ready"
      | "error";
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
type SimpleRecordingRecord = DBRecordItem<SimpleRecording>;

interface SimpleRecordingCampaign {
   organization: OrganizationRecord["id"];
   title: string;
   description?: string;
}
type SimpleRecordingCampaignRecord = DBRecordItem<SimpleRecordingCampaign>;

interface SimpleRecordingLivestream {
   organization: OrganizationRecord["id"];
   livestreamSession: LivestreamSessionRecord["id"];
   recording: SimpleRecordingRecord["id"];
}

type SimpleRecordingLivestreamRecord = DBRecordItem<SimpleRecordingLivestream>;
