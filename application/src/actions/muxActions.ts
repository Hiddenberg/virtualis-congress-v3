"use server";

import { revalidatePath } from "next/cache";
import { RecordModel } from "pocketbase";
import mux from "@/libs/mux";
import { getMuxAssetById } from "@/services/muxServices";
import {
   getExpandedRecordingById,
   updateRecordingDate,
} from "@/services/recordingServices";
import { updateVideoAsset } from "@/services/videoAssetsServices";
import { ConferenceRecording } from "@/types/congress";

export async function createMuxUploadUrlAction(
   recordingId: (ConferenceRecording & RecordModel)["id"],
   isSimpleRecording?: boolean,
) {
   try {
      const muxUploadUrl = await mux.video.uploads.create({
         cors_origin:
            process.env.NODE_ENV === "development"
               ? "http://localhost:3000"
               : "https://acp-congress.virtualis.app",
         new_asset_settings: {
            passthrough: recordingId,
            playback_policy: ["public"],
            video_quality: "basic",
            static_renditions: isSimpleRecording
               ? [
                    {
                       resolution: "highest",
                    },
                 ]
               : undefined,
         },
         timeout: 10800, // 3 hours
      });

      return {
         success: true,
         url: muxUploadUrl.url,
         id: muxUploadUrl.id,
      };
   } catch (error) {
      const err = error as Error;
      return {
         success: false,
         error: err.message,
      };
   }
}

export async function completeUploadAction(
   upladId: string,
   recordingId: string,
   videoAssetId: string,
) {
   const muxUpload = await mux.video.uploads.retrieve(upladId);
   const recordingObject = await getExpandedRecordingById(recordingId);

   if (!recordingObject) {
      console.error("[MuxActions] Recording not found");
      return null;
   }

   const muxAssetId = muxUpload.asset_id;

   if (!muxAssetId) {
      console.error("[MuxActions] Asset not found");
      return null;
   }

   const assetInfo = await getMuxAssetById(muxAssetId);
   if (!assetInfo) {
      console.error("[MuxActions] Asset not found");
      return null;
   }

   const playbackIds = assetInfo.playback_ids;

   if (!playbackIds) {
      console.log("[MuxActions] Playback ids not found");
      return null;
   }

   const playbackId = playbackIds[0].id;

   await updateVideoAsset(videoAssetId, {
      muxAssetId: muxAssetId,
      muxPlaybackId: playbackId,
   });

   console.log("[MuxActions] assetId", muxAssetId);
   console.log("[MuxActions] recordingId", recordingId);
   await updateRecordingDate(recordingId);

   return muxAssetId;
}

export async function completeManualUploadAction(
   uploadId: string,
   recordingId: string,
   videoAssetId: string,
) {
   const muxUpload = await mux.video.uploads.retrieve(uploadId);
   const assetId = muxUpload.asset_id;
   const recording = await getExpandedRecordingById(recordingId);

   if (!assetId) {
      console.error("Asset not found");
      return {
         error: "Asset not found",
      };
   }
   if (!recording) {
      console.error("Recording not found");
      return {
         error: "Recording not found",
      };
   }

   const muxAsset = await mux.video.assets.retrieve(assetId);
   const playbackIds = muxAsset.playback_ids;

   if (!playbackIds) {
      console.error("Playback id not found");
      return {
         error: "Playback id not found",
      };
   }

   const playbackId = playbackIds[0].id;

   await updateVideoAsset(videoAssetId, {
      muxAssetId: assetId,
      muxPlaybackId: playbackId,
      muxAssetStatus: muxAsset.status,
   });

   await updateRecordingDate(recordingId);
   revalidatePath(
      "/congress-admin/conference-calendar/[conferenceDate]",
      "layout",
   );

   return {
      success: true,
      message: "Video asset created successfully",
   };
}
