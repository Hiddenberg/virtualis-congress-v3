import {
   createDBRecord,
   deleteDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import { deleteMuxAsset } from "@/services/muxServices";
import "server-only";
import { sendRecordingInvitationEmail } from "@/features/emails/services/emailSendingServices";
import { deleteLivestreamSessionResources } from "@/features/livestreams/services/livestreamSessionServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getAllCampaignRecordings } from "@/features/simpleRecordings/services/recordingCampaignsServices";
import { getRecordingLivestreamSessionByRecordingId } from "./recordingLivestreamServices";

export async function createRecordingRecord(recording: SimpleRecording) {
   const createdRecording = await createDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", {
      ...recording,
   } satisfies SimpleRecording);

   return createdRecording;
}

export async function getAllSimpleRecordings() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );
   const recordings = await getFullDBRecordsList<SimpleRecording>("SIMPLE_RECORDINGS", {
      filter,
   });

   return recordings;
}

export async function getSimpleRecordingById(recordingId: SimpleRecordingRecord["id"]) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      id = {:recordingId}
   `,
      {
         organizationId: organization.id,
         recordingId,
      },
   );
   const recording = await getSingleDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", filter);

   return recording;
}

export async function getSimpleRecordingByTitleAndCampaign({
   title,
   campaignId,
}: {
   title: string;
   campaignId: SimpleRecordingCampaignRecord["id"];
}) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      title = {:title} &&
      campaign = {:campaignId}
   `,
      {
         organizationId: organization.id,
         title,
         campaignId,
      },
   );

   const recording = await getSingleDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", filter);

   return recording;
}

export async function getGlobalSimpleRecordingByMuxAssetId(muxAssetId: string) {
   const filter = pbFilter(
      `
      muxAssetId = {:muxAssetId}
   `,
      {
         muxAssetId,
      },
   );

   const recording = await getSingleDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", filter);

   return recording;
}

export async function updateSimpleRecording(recordingId: string, recording: Partial<SimpleRecording>) {
   const updatedRecording = await updateDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", recordingId, recording);

   return updatedRecording;
}

export async function updateSimpleRecordingDuration(recordingId: string, newDuration: number) {
   // making sure that the recording exists and it belongs to the organization
   const recording = await getSimpleRecordingById(recordingId);
   if (!recording) {
      console.error("[Recordings Services] Recording not found", recordingId);
      return;
   }

   const updatedRecording = await updateDBRecord<SimpleRecording>("SIMPLE_RECORDINGS", recordingId, {
      durationSeconds: newDuration,
   });

   return updatedRecording;
}

export async function deleteRecording(recordingId: string) {
   const recording = await getSimpleRecordingById(recordingId);

   if (!recording) {
      console.error("[Recordings Services] Recording not found", recordingId);
      return;
   }

   const recordingLivestreamSession = await getRecordingLivestreamSessionByRecordingId(recording.id);
   if (recordingLivestreamSession) {
      await deleteLivestreamSessionResources(recordingLivestreamSession.id);
   }

   if (recording.muxAssetId) {
      await deleteMuxAsset(recording.muxAssetId);
   }

   const deletedRecording = await deleteDBRecord("SIMPLE_RECORDINGS", recordingId);
   return deletedRecording;
}

export async function sendCampaignRecordingInvitations(campaignId: string) {
   const campaignRecordings = await getAllCampaignRecordings(campaignId);

   const recordingsToSend = campaignRecordings.filter((recording) => recording.invitationEmailStatus === "not_sent");

   let sent = 0;
   for (const recording of recordingsToSend) {
      try {
         await sendRecordingInvitationEmail(recording.id);
         await updateSimpleRecording(recording.id, {
            invitationEmailStatus: "sent",
         });
         sent += 1;
      } catch (error) {
         console.error("[sendCampaignRecordingInvitations] Error sending invite for recording", recording.id, error);
         // sendRecordingInvitationEmail already sets status to "error" on failure
      }
   }

   return {
      total: recordingsToSend.length,
      sent,
      pendingAfter: recordingsToSend.length - sent,
   };
}
