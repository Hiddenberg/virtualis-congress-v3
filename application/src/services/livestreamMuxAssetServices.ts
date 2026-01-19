import { ClientResponseError, type RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import pbServerClient from "@/libs/pbServerClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";

export type LivestreamMuxAssetRecord = LivestreamMuxLivestream & RecordModel;

interface NewLivestreamMuxAssetData {
   conferenceId: string;
   livestreamSessionId: string;
   muxLivestreamId: string;
   streamKey: string;
   livestreamPlaybackId: string;
}
export async function createLivestreamMuxAsset({
   conferenceId,
   livestreamSessionId,
   muxLivestreamId,
   streamKey,
   livestreamPlaybackId,
}: NewLivestreamMuxAssetData) {
   try {
      console.log(
         "[Livestream Mux Asset Service] Creating livestream mux asset for conference",
         conferenceId,
      );
      const newLivestreamMuxAssetData: LivestreamMuxLivestream = {
         organization: TEMP_CONSTANTS.ORGANIZATION_ID,
         livestreamSession: livestreamSessionId,
         muxLivestreamId,
         streamKey,
         livestreamPlaybackId,
      };

      const newLivestreamMuxAsset = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_MUX_LIVESTREAMS)
         .create<LivestreamMuxAssetRecord>(newLivestreamMuxAssetData);

      console.log(
         "[Livestream Mux Asset Service] Livestream mux asset created successfully",
         newLivestreamMuxAsset,
      );
      return newLivestreamMuxAsset;
   } catch (error) {
      console.error(
         "[Livestream Mux Asset Service] Error creating livestream mux asset",
         error,
      );
      throw error;
   }
}

export async function getQnALivestreamMuxAssetForConference(
   conferenceId: string,
) {
   try {
      const qnaLivestreamMuxAsset = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_MUX_LIVESTREAMS)
         .getFirstListItem<LivestreamMuxAssetRecord>(
            `conference.id = "${conferenceId}" && livestreamSession.sessionType = "qna_live"`,
         );

      return qnaLivestreamMuxAsset;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }

      console.error(
         "[Livestream Mux Asset Service] Error getting qna livestream mux asset for conference",
         error,
      );
      throw error;
   }
}
