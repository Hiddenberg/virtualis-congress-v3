import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import mux from "@/libs/mux";
import {
   createDBRecord,
   deleteDBRecord,
   getSingleDBRecord,
} from "@/libs/pbServerClientNew";

import "server-only";

export async function createMuxLivestream(
   livestreamSessionId: LivestreamSessionRecord["id"],
) {
   const currentOrganization = await getOrganizationFromSubdomain();

   if (!currentOrganization) {
      throw new Error(
         "[Livestream Mux Asset Service] Current organization not found",
      );
   }

   const newMuxLivestream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: {
         playback_policy: ["public"],
      },
      reconnect_window: 60 * 5, // 5 minutes
      passthrough: livestreamSessionId,
   });

   const newLivestreamMuxAsset = await createDBRecord<LivestreamMuxLivestream>(
      "LIVESTREAM_MUX_LIVESTREAMS",
      {
         organization: currentOrganization.id,
         livestreamSession: livestreamSessionId,
         muxLivestreamId: newMuxLivestream.id,
         livestreamPlaybackId: newMuxLivestream.playback_ids?.[0]?.id || "",
         streamKey: newMuxLivestream.stream_key,
      },
   );

   return newLivestreamMuxAsset;
}

export async function getMuxAssetByMuxLivestreamId(muxLivestreamId: string) {
   const muxAsset = await mux.video.assets.list({
      live_stream_id: muxLivestreamId,
   });
   if (!muxAsset.data[0]) {
      return null;
   }
   return muxAsset.data[0];
}

export async function getMuxLivestreamRecordByLivestreamSessionId(
   livestreamSessionId: LivestreamSessionRecord["id"],
) {
   const currentOrganization = await getOrganizationFromSubdomain();

   if (!currentOrganization) {
      throw new Error(
         "[Livestream Mux Asset Service] Current organization not found",
      );
   }

   const livestreamMuxAsset = await getSingleDBRecord<LivestreamMuxLivestream>(
      "LIVESTREAM_MUX_LIVESTREAMS",
      `organization = "${currentOrganization.id}" && livestreamSession = "${livestreamSessionId}"`,
   );

   return livestreamMuxAsset;
}

export async function completeMuxLivestream(
   livestreamSessionId: LivestreamSessionRecord["id"],
) {
   const livestreamSession =
      await getMuxLivestreamRecordByLivestreamSessionId(livestreamSessionId);

   if (!livestreamSession) {
      throw new Error(
         "[Livestream Mux Asset Service] Livestream session not found",
      );
   }

   await mux.video.liveStreams.complete(livestreamSession.muxLivestreamId);
}

export async function deleteMuxLivestream(
   livestreamSessionId: LivestreamSessionRecord["id"],
) {
   const currentOrganization = await getOrganizationFromSubdomain();

   if (!currentOrganization) {
      throw new Error(
         "[Livestream Mux Asset Service] Current organization not found",
      );
   }

   const livestreamMuxAsset = await getSingleDBRecord<LivestreamMuxLivestream>(
      "LIVESTREAM_MUX_LIVESTREAMS",
      `organization = "${currentOrganization.id}" && livestreamSession = "${livestreamSessionId}"`,
   );

   if (!livestreamMuxAsset) {
      console.error(
         `[Livestream Mux Asset Service] Livestream Mux Asset not found for livestream session ${livestreamSessionId}`,
      );
      return;
   }

   try {
      await mux.video.liveStreams.delete(livestreamMuxAsset.muxLivestreamId);
   } catch (error) {
      if (error instanceof Error && error.message.includes("not_found")) {
         console.log(
            `[Livestream Mux Asset Service] Mux livestream asset not found or already deleted for livestream session ${livestreamSessionId}`,
         );
      } else {
         throw new Error(
            `[Livestream Mux Asset Service] Error deleting mux livestream ${livestreamMuxAsset.muxLivestreamId}`,
         );
      }
   }

   await deleteDBRecord("LIVESTREAM_MUX_LIVESTREAMS", livestreamMuxAsset.id);
   console.log(
      `[Livestream Mux Asset Service] Livestream Mux Asset deleted for livestream session ${livestreamSessionId}`,
   );
}
