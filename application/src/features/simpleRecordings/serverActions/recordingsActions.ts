"use server";

import { revalidatePath } from "next/cache";
import { sendRecordingInvitationEmail, sendRecordingReminderEmail } from "@/features/emails/services/emailSendingServices";
import { updateLivestreamSession } from "@/features/livestreams/services/livestreamSessionServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createMuxStaticRendition, deleteMuxAsset, getMuxAssetByUploadId } from "@/services/muxServices";
import { createRecordingLivestream, getRecordingLivestreamSessionByRecordingId } from "../services/recordingLivestreamServices";
import { deletePresentationRecordingForRecording } from "../services/recordingPresentationsServices";
import {
   createRecordingRecord,
   deleteRecording,
   getSimpleRecordingById,
   sendCampaignRecordingInvitations,
   updateSimpleRecording,
} from "../services/recordingsServices";
import type { SimpleRecording } from "../types/recordingsTypes";

interface ScheduleRecordingActionProps {
   title: string;
   campaignId: string;
   personName: string;
   personEmail: string;
   sendInvitation: boolean;
   recordingType: SimpleRecording["recordingType"];
}

export async function scheduleRecordingAction({
   title,
   campaignId,
   personName,
   personEmail,
   sendInvitation,
   recordingType,
}: ScheduleRecordingActionProps): Promise<BackendResponse> {
   try {
      const organization = await getOrganizationFromSubdomain();

      const recordingCreated = await createRecordingRecord({
         organization: organization.id,
         campaign: campaignId,
         title,
         recorderName: personName,
         recorderEmail: personEmail,
         status: "scheduled",
         invitationEmailStatus: "not_sent",
         recordingType,
         durationSeconds: 0,
      });

      await createRecordingLivestream(recordingCreated.id);

      if (sendInvitation) {
         await sendRecordingInvitationEmail(recordingCreated.id);
         await updateSimpleRecording(recordingCreated.id, {
            invitationEmailStatus: "sent",
         });
      }

      return {
         success: true,
         data: recordingCreated,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function updateRecordingAction(
   recordingId: string,
   recording: Partial<SimpleRecording>,
): Promise<BackendResponse<SimpleRecording>> {
   try {
      const updatedRecording = await updateSimpleRecording(recordingId, recording);

      return {
         success: true,
         data: updatedRecording,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function completeRecordingUploadAction(recordingId: string, muxUploadId: string): Promise<BackendResponse<null>> {
   try {
      // get the mux asset and playback Id
      const muxAsset = await getMuxAssetByUploadId(muxUploadId);

      if (!muxAsset) {
         return {
            success: false,
            errorMessage: "[CompleteRecordingUploadAction] Mux asset not found",
         };
      }

      const playbackId = muxAsset.playback_ids?.[0]?.id;

      if (!playbackId) {
         return {
            success: false,
            errorMessage: "[CompleteRecordingUploadAction] Playback ID not found",
         };
      }

      // update the recording with the mux asset and playback Id
      await updateRecordingAction(recordingId, {
         status: "processing",
         muxAssetId: muxAsset.id,
         muxPlaybackId: playbackId,
      });

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function deleteRecordingAction(recordingId: string): Promise<BackendResponse<null>> {
   try {
      await deleteRecording(recordingId);

      revalidatePath("/recordings");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendRecordingInvitationEmailAction(
   recordingId: string,
   maxDeadline?: string,
): Promise<BackendResponse<null>> {
   try {
      await sendRecordingInvitationEmail(recordingId, maxDeadline);

      revalidatePath("/recordings/campaign/[campaignId]", "page");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendRecordingReminderEmailAction(recordingId: string): Promise<BackendResponse<null>> {
   try {
      await sendRecordingReminderEmail(recordingId);

      revalidatePath("/recordings/campaign/[campaignId]", "page");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function sendCampaignInvitationsAction(
   campaignId: string,
): Promise<BackendResponse<{ sent: number; total: number }>> {
   try {
      const result = await sendCampaignRecordingInvitations(campaignId);

      revalidatePath(`/recordings/campaign/${campaignId}`);

      return {
         success: true,
         data: {
            sent: result.sent,
            total: result.total,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "An unknown error occurred",
      };
   }
}

export async function acceptRecordingAction(recordingId: string): Promise<BackendResponse<null>> {
   try {
      const recording = await getSimpleRecordingById(recordingId);
      if (!recording) {
         return {
            success: false,
            errorMessage: "[AcceptRecordingAction] Recording not found",
         };
      }
      if (!recording.muxAssetId) {
         return {
            success: false,
            errorMessage: "[AcceptRecordingAction] Mux asset not found",
         };
      }

      await createMuxStaticRendition(recording.muxAssetId);
      await updateSimpleRecording(recordingId, {
         status: "processing",
      });

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error("[acceptRecordingAction] An unknown error occurred", error);
      return {
         success: false,
         errorMessage: "[acceptRecordingAction] An unknown error occurred",
      };
   }
}

export async function rejectRecordingAction(recordingId: string): Promise<BackendResponse<null>> {
   try {
      const recording = await getSimpleRecordingById(recordingId);
      if (!recording) {
         return {
            success: false,
            errorMessage: "[RejectRecordingAction] Recording not found",
         };
      }
      if (!recording.muxAssetId) {
         return {
            success: false,
            errorMessage: "[RejectRecordingAction] Mux asset not found",
         };
      }

      await deletePresentationRecordingForRecording(recordingId);

      const recordingLivestreamSession = await getRecordingLivestreamSessionByRecordingId(recordingId);
      if (!recordingLivestreamSession) {
         return {
            success: false,
            errorMessage: "[RejectRecordingAction] Recording livestream session not found",
         };
      }

      await deleteMuxAsset(recording.muxAssetId);
      await updateLivestreamSession(recordingLivestreamSession.id, {
         status: "scheduled",
         attendantStatus: "scheduled",
      });
      await updateSimpleRecording(recordingId, {
         status: "scheduled",
         muxAssetId: "",
         muxPlaybackId: "",
         muxDownloadURL: "",
         durationSeconds: 0,
      });

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      console.error("[rejectRecordingAction] An unknown error occurred", error);
      return {
         success: false,
         errorMessage: "[rejectRecordingAction] An unknown error occurred",
      };
   }
}

export async function completeManualRecordingVideoUploadAction(
   recordingId: string,
   muxUploadId: string,
): Promise<BackendResponse<null>> {
   try {
      const recording = await getSimpleRecordingById(recordingId);
      if (!recording) {
         return {
            success: false,
            errorMessage: "[CompleteManualRecordingVideoUploadAction] Recording not found",
         };
      }

      const muxAsset = await getMuxAssetByUploadId(muxUploadId);
      if (!muxAsset) {
         return {
            success: false,
            errorMessage: "[CompleteManualRecordingVideoUploadAction] Mux asset not found",
         };
      }

      const playbackId = muxAsset.playback_ids?.[0]?.id;
      if (!playbackId) {
         return {
            success: false,
            errorMessage: "[CompleteManualRecordingVideoUploadAction] Playback ID not found",
         };
      }

      await updateSimpleRecording(recordingId, {
         status: "processing",
         muxAssetId: muxAsset.id,
         muxPlaybackId: playbackId,
      });

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
   }

   return {
      success: true,
      data: null,
   };
}
