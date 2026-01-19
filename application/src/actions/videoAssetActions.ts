"use server";

import { getRecordingById } from "@/services/recordingServices";
import { createNewVideoAsset } from "@/services/videoAssetsServices";
import type { ConferenceVideoAsset } from "@/types/congress";

export async function createVideoAssetAction(
   recordingId: string,
   muxUploadId: string,
   videoType: ConferenceVideoAsset["videoType"],
) {
   const recording = await getRecordingById(recordingId);

   if (!recording) {
      return {
         success: false,
         error: "Recording not found when creating video asset" + recordingId,
      };
   }

   const newVideoAsset = await createNewVideoAsset({
      conferenceId: recording.conference,
      recordingId: recordingId,
      videoType: videoType,
      muxUploadId: muxUploadId,
   });

   return {
      success: true,
      videoAsset: newVideoAsset,
   };
}
