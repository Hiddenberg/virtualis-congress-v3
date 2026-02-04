import { RecordModel } from "pocketbase";
import { AcademicTitle } from "@/data/utils";
import { UserRecord } from "@/features/users/types/userTypes";

interface SpeakerData {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   displayName: string;
   user?: UserRecord["id"];
   academicTitle?: AcademicTitle;
   specialityDetails?: string;
   bio?: string;
   presentationPhoto?: string | File;
}
export type SpeakerDataRecord = DBRecordItem<SpeakerData>;

interface ACPMemberData {
   acpID: string;
   fullName: string;
   acpMemberClass: string;
   email: string;
   age: number;
   city: string;
   isBlackListed: boolean;
}

interface UserStripeData {
   organization: (Organization & RecordModel)["id"];
   user: (User & RecordModel)["id"];
   stripeCustomerId: string;
}

// interface UserPayment {
//    organization: (Organization & RecordModel)["id"]
//    user: (User & RecordModel)["id"]
//    totalAmount: number
//    discount: number
//    currency: string
//    stripeCheckoutSessionId: string
//    stripePaymentIntentId?: string
//    paymentMethod?: string
//    status: string
// }

interface CourtesyInvitation {
   organization: (Organization & RecordModel)["id"];
   congress: (Congress & RecordModel)["id"];
   stripePromotionCode: string;
   used: boolean;
   userWhoRedeemed?: (User & RecordModel)["id"];
   sentTo?: string;
   redeemedAt?: string;
}

interface ConferenceRecording {
   organization: (Organization & RecordModel)["id"];
   conference: (CongressConference & RecordModel)["id"];
   status:
      | "pending"
      | "recording"
      | "uploading"
      | "processing"
      | "available"
      | "failed";
   usersWhoWillRecord: (User & RecordModel)["id"][];
   recordingUrl: string;
   durationSeconds: number;
   recordedAt?: string;
   recordingType: "conference" | "presentation" | "group_conference";
   invitationEmailSent: boolean;
   invitationEmailOpened: boolean;
   invitationEmailOpenedAt?: string;
   lastReminderSentAt?: string;
   lastReminderOpenedAt?: string;
   remindersSentCount: number;
   reRecordingEmailSent?: boolean;
   reRecordingEmailSentAt?: string;
   reRecordingEmailOpenedAt?: string;
   startedRecordingAt?: string;
   preformanceMetrics?: string;
}

interface ConferenceVideoAsset {
   organization: (Organization & RecordModel)["id"];
   conference: (CongressConference & RecordModel)["id"];
   recording: (ConferenceRecording & RecordModel)["id"];
   muxUploadId: string;
   muxAssetId?: string;
   muxPlaybackId?: string;
   videoType: "camera" | "screen" | "combined" | "other";
   muxAssetStatus: "uploading" | "preparing" | "ready" | "errored";
   errorMessage?: string;
}

// interface LivestreamSession {
//    organization: (Organization & RecordModel)["id"]
//    congress: (Congress & RecordModel)["id"]
//    conference: (CongressConference & RecordModel)["id"]
//    sessionType: "qna_live" | "conference_live"
//    status: "scheduled" | "preparing" | "streaming" | "paused" | "ended" | "canceled" | "skipped" | "moved_to_zoom"
//    attendantStatus: "scheduled" | "preparing" | "streaming" | "paused" | "ended" | "canceled" | "skipped" | "moved_to_zoom"
//    zoomEmergencyLink?: string
//    startedAt?: string
//    endedAt?: string
// }

// interface LivestreamMuxAsset {
//    organization: (Organization & RecordModel)["id"]
//    conference: (CongressConference & RecordModel)["id"]
//    livestreamSession: (LivestreamSession & RecordModel)["id"]
//    muxLivestreamId: string
//    streamKey: string
//    livestreamPlaybackId: string
// }

// Chat
interface ChatMessage {
   organization: (Organization & RecordModel)["id"];
   conference: (CongressConference & RecordModel)["id"];
   user?: (User & RecordModel)["id"];
   userName?: string;
   messageText: string;
   isQuestion: boolean;
   userIp: string;
}

interface ChatBanned {
   organization: (Organization & RecordModel)["id"];
   user: (User & RecordModel)["id"];
   bannedIp: string;
}
