import axios from "axios";
import mux from "@/libs/mux";
import "server-only";

export async function createMuxStaticRendition(muxAssetId: string) {
   const muxAsset = await getMuxAssetById(muxAssetId);

   if (!muxAsset) {
      console.error(
         "[createMuxStaticRendition] Error creating mux static rendition",
         muxAssetId,
      );
      throw new Error("Mux asset not found");
   }

   await mux.video.assets.createStaticRendition(muxAsset.id, {
      resolution: "highest",
   });
}

/**
 * Retrieves a Mux video asset by its ID.
 *
 * @param muxAssetId - The ID of the Mux video asset to retrieve.
 * @returns A promise that resolves to the retrieved asset or null if the asset is not found.
 */
export async function getMuxAssetById(muxAssetId: string) {
   try {
      const asset = await mux.video.assets.retrieve(muxAssetId);
      return asset;
   } catch (error) {
      console.error(error);
      return null;
   }
}

/**
 * Retrieves a Mux video asset by its upload ID.
 *
 * @param muxUploadId - The ID of the Mux video upload to retrieve.
 * @returns A promise that resolves to the retrieved asset or null if the asset is not found.
 */
export async function getMuxAssetByUploadId(muxUploadId: string) {
   try {
      const muxUpload = await mux.video.uploads.retrieve(muxUploadId);

      if (!muxUpload.asset_id) {
         console.error(
            "[Mux Service] Error getting mux asset by upload id",
            muxUploadId,
         );
         return null;
      }

      const muxAsset = await getMuxAssetById(muxUpload.asset_id);

      return muxAsset;
   } catch (error) {
      console.error(
         "[Mux Service] Error getting mux asset by upload id",
         error,
      );
      return null;
   }
}

/**
 * Deletes a Mux video asset by its ID.
 *
 * @param muxAssetId - The ID of the Mux video asset to delete.
 * @returns A promise that resolves to the deleted asset or null if the asset is not found or already deleted.
 */
export async function deleteMuxAsset(muxAssetId: string) {
   const asset = await getMuxAssetById(muxAssetId);
   if (!asset) {
      console.error(`Asset ${muxAssetId} not found or already deleted`);
      return;
   }

   await mux.video.assets.delete(muxAssetId);
   console.log(`Mux asset ${muxAssetId} deleted`);
}

// Livestreams
export async function createMuxLiveStream(passthrough: string) {
   try {
      console.log(
         "[Mux Service] Creating mux live stream with passthrough",
         passthrough,
      );
      const muxLiveStream = await mux.video.liveStreams.create({
         playback_policy: ["public"],
         new_asset_settings: {
            playback_policy: ["public"],
         },
         passthrough: passthrough,
      });

      console.log(
         "[Mux Service] Mux live stream created successfully",
         muxLiveStream,
      );
      return muxLiveStream;
   } catch (error) {
      console.error("[Mux Service] Error creating mux live stream", error);
      throw error;
   }
}

export async function retrieveMuxLiveStream(muxLiveStreamId: string) {
   try {
      const muxLiveStream =
         await mux.video.liveStreams.retrieve(muxLiveStreamId);
      return muxLiveStream;
   } catch (error) {
      console.error("[Mux Service] Error retrieving mux live stream", error);
      throw error;
   }
}

export async function finishMuxLiveStream(muxLiveStreamId: string) {
   try {
      console.log("[Mux Service] Finishing mux live stream", muxLiveStreamId);
      await mux.video.liveStreams.complete(muxLiveStreamId);
      console.log("[Mux Service] Mux live stream finished", muxLiveStreamId);
   } catch (error) {
      console.error("[Mux Service] Error finishing mux live stream", error);
      throw error;
   }
}

export async function getMuxAssetDuration(muxAssetId: string) {
   const muxAsset = await mux.video.assets.retrieve(muxAssetId);
   if (!muxAsset) {
      console.error(
         "[Mux Service] Error getting mux asset duration",
         muxAssetId,
      );
      throw new Error("Mux asset not found");
   }
   return muxAsset.duration;
}

export async function generateMuxCaptions(
   muxAssetId: string,
   videoAssetId: string,
) {
   const muxAsset = await mux.video.assets.retrieve(muxAssetId);

   if (!muxAsset) {
      console.error(
         "[Mux Service] Error getting mux asset captions",
         muxAssetId,
      );
      throw new Error("Mux asset not found");
   }

   const asssetTracks = muxAsset.tracks;

   if (!asssetTracks) {
      console.error(
         "[Mux Service] Error getting mux asset captions",
         muxAssetId,
      );
      throw new Error("Mux asset tracks not found");
   }

   const audioTracks = asssetTracks.filter((track) => track.type === "audio");

   if (!audioTracks[0].id) {
      console.error(
         "[Mux Service] Error getting mux asset captions",
         muxAssetId,
      );
      throw new Error("Mux asset audio track not found");
   }

   try {
      await mux.video.assets.generateSubtitles(muxAssetId, audioTracks[0].id, {
         generated_subtitles: [
            {
               language_code: "es",
               name: "Spanish CC",
               passthrough: `video_asset_id:${videoAssetId}`,
            },
         ],
      });
   } catch (error) {
      console.error("[Mux Service] Error generating mux asset captions", error);
      throw error;
   }
}

export async function getMuxAssetSubtitles(muxAssetId: string) {
   const muxAsset = await mux.video.assets.retrieve(muxAssetId);
   if (!muxAsset) {
      console.error(
         "[Mux Service] Error getting mux asset subtitles",
         muxAssetId,
      );
      throw new Error("Mux asset not found");
   }

   const muxAssetTracks = muxAsset.tracks;

   if (!muxAssetTracks) {
      console.error(
         "[Mux Service] Error getting mux asset subtitles",
         muxAssetId,
      );
      throw new Error("Mux asset tracks not found");
   }

   const textTracks = muxAssetTracks.filter((track) => track.type === "text");

   if (!textTracks[0].id) {
      console.error(
         "[Mux Service] Error getting mux asset subtitles",
         muxAssetId,
      );
      throw new Error("Mux asset text track not found");
   }

   const playbackIds = muxAsset.playback_ids;

   if (!playbackIds?.[0]?.id) {
      console.error(
         "[Mux Service] Error getting mux asset subtitles",
         muxAssetId,
      );
      throw new Error("Mux asset playback id not found");
   }

   const response = await axios.get(
      `https://stream.mux.com/${playbackIds[0].id}/text/${textTracks[0].id}.vtt`,
   );

   return response.data;
}

// PENDING: This is not working, we need to find a way to create a new asset track with the translated subtitles
// export async function createMuxTranslatedSubtitlesAssetTrack(muxAssetId: string, translatedSubtitlesUrl: string) {
//    const muxAsset = await mux.video.assets.retrieve(muxAssetId)
//    if (!muxAsset) {
//       console.error("[Mux Service] Error getting mux asset subtitles", muxAssetId)
//       throw new Error("Mux asset not found")
//    }

//    await mux.video.assets.createTrack(muxAssetId, {
//       language_code: "en",
//       type: "text",
//       url: translatedSubtitlesUrl
//    })
// }
