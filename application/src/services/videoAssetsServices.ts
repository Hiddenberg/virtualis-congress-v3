import { ClientResponseError, type RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import pbServerClient from "@/libs/pbServerClient";
import type { ConferenceVideoAsset } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";

export interface NewVideoAssetData {
   conferenceId: string;
   recordingId: string;
   videoType: ConferenceVideoAsset["videoType"];
   muxUploadId: string;
}
export async function createNewVideoAsset({
   conferenceId,
   recordingId,
   videoType,
   muxUploadId,
}: NewVideoAssetData) {
   const newVideoAsset: ConferenceVideoAsset = {
      organization: TEMP_CONSTANTS.ORGANIZATION_ID,
      recording: recordingId,
      conference: conferenceId,
      muxUploadId,
      videoType,
      muxAssetStatus: "uploading",
   };

   const videoAssetCreated = await pbServerClient
      .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
      .create<ConferenceVideoAsset & RecordModel>(newVideoAsset);

   console.log(
      `[Video Assets Services] Video asset created ${videoAssetCreated.id} for recording ${recordingId}, type: ${videoAssetCreated.videoType}`,
   );
   return videoAssetCreated;
}

export async function getVideoAssetById(videoAssetId: string) {
   try {
      const videoAsset = await pbServerClient
         .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
         .getOne<ConferenceVideoAsset & RecordModel>(videoAssetId);

      return videoAsset;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function getVideoAssetByMuxAssetId(muxId: string) {
   try {
      const videoAsset = await pbServerClient
         .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
         .getFirstListItem<ConferenceVideoAsset & RecordModel>(
            `muxAssetId = "${muxId}"`,
         );
      return videoAsset;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function getVideoAssetByMuxUploadId(muxUploadId: string) {
   try {
      const videoAsset = await pbServerClient
         .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
         .getFirstListItem<ConferenceVideoAsset & RecordModel>(
            `muxUploadId = "${muxUploadId}"`,
         );
      return videoAsset;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function getVideoAssetsForConference(conferenceId: string) {
   const filter = `conference = "${conferenceId}"`;
   const conferenceVideoAssets = await pbServerClient
      .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
      .getFullList<ConferenceVideoAsset & RecordModel>({
         filter,
      });

   return conferenceVideoAssets;
}

export async function getVideoAssetsForRecording(recordingId: string) {
   const filter = `recording = "${recordingId}"`;
   const recordingVideoAssets = await pbServerClient
      .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
      .getFullList<ConferenceVideoAsset & RecordModel>({
         filter,
         sort: "-videoType",
      });

   return recordingVideoAssets;
}

export async function updateVideoAsset(
   videoAssetId: string,
   newData: Partial<ConferenceVideoAsset>,
) {
   try {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
         .update(videoAssetId, newData);
   } catch (error) {
      console.error("Error updating video asset", error);
      throw error;
   }
}

export async function updateVideoAssetStatus(
   videoAssetId: string,
   status: ConferenceVideoAsset["muxAssetStatus"],
) {
   try {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
         .update(videoAssetId, {
            muxAssetStatus: status,
         } satisfies Partial<ConferenceVideoAsset>);
   } catch (error) {
      console.error("Error updating video asset status", error);
      throw error;
   }
}

export async function deleteVideoAsset(videoAssetId: string) {
   const videoAsset = await getVideoAssetById(videoAssetId);

   if (!videoAsset) {
      console.log("Video asset not found");
      return null;
   }

   // await mux.video.assets.delete(videoAsset.muxAssetId)
   // console.log("Deleted MUX video asset", videoAsset.muxAssetId)

   await pbServerClient
      .collection(PB_COLLECTIONS.CONFERENCE_VIDEO_ASSETS)
      .delete(videoAssetId);
   console.log("Deleted PB video asset", videoAssetId);
}

export async function deleteAllVideoAssetsForConference(conferenceId: string) {
   console.log("Deleting conference video assets", conferenceId);
   const conferenceVideoAssets =
      await getVideoAssetsForConference(conferenceId);

   for (const videoAsset of conferenceVideoAssets) {
      await deleteVideoAsset(videoAsset.id);
   }
}

export async function deleteAllVideoAssetsForRecording(recordingId: string) {
   const recordingVideoAssets = await getVideoAssetsForRecording(recordingId);

   if (recordingVideoAssets.length === 0) {
      console.log(
         "No previous video assets found for recording, skipping deletion",
         recordingId,
      );
      return;
   }

   for (const videoAsset of recordingVideoAssets) {
      await deleteVideoAsset(videoAsset.id);
      console.log(
         `Deleted video asset ${videoAsset.id} for recording ${recordingId} muxAssetId: ${videoAsset.muxAssetId}`,
      );
   }
}
