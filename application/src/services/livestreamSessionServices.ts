import { ClientResponseError, RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import pbServerClient from "@/libs/pbServerClient";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";
import {
   createLivestreamMuxAsset,
   getQnALivestreamMuxAssetForConference,
   LivestreamMuxAssetRecord,
} from "./livestreamMuxAssetServices";
import { createMuxLiveStream } from "./muxServices";

export type LivestreamSessionRecord = LivestreamSession & RecordModel;
export async function createLivestreamSession(
   conferenceId: string,
   // sessionType: "qna_live" | "conference_live"
) {
   try {
      console.log(
         "[Livestream Session Service] Creating livestream session for conference",
         conferenceId,
      );
      const newLivestreamSessionData: LivestreamSession = {
         organization: TEMP_CONSTANTS.ORGANIZATION_ID,
         // congress: TEMP_CONSTANTS.CONGRESS_ID,
         // conference: conferenceId,
         // sessionType,
         status: "scheduled",
         attendantStatus: "scheduled",
      };

      const newLivestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .create<LivestreamSessionRecord>(newLivestreamSessionData);

      console.log(
         "[Livestream Session Service] Livestream session created successfully",
         newLivestreamSession,
      );
      return newLivestreamSession;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error creating livestream session",
         error,
      );
      throw error;
   }
}

export async function prepareQnALivestreamSessionForConference(
   conferenceId: string,
) {
   try {
      console.log(
         "[Livestream Session Service] Preparing qna livestream session for conference",
         conferenceId,
      );
      const livestreamSession = await createLivestreamSession(conferenceId);

      const muxLiveStream = await createMuxLiveStream(
         `Live for conf: ${conferenceId}`,
      );

      await createLivestreamMuxAsset({
         conferenceId: conferenceId,
         livestreamSessionId: livestreamSession.id,
         muxLivestreamId: muxLiveStream.id,
         livestreamPlaybackId: muxLiveStream.playback_ids![0].id,
         streamKey: muxLiveStream.stream_key,
      });

      console.log(
         "[Livestream Session Service] QnA livestream session prepared successfully",
         livestreamSession,
      );
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error preparing qna livestream session for conference",
         error,
      );
      throw error;
   }
}

export async function getLivestreamSessionById(livestreamSessionId: string) {
   try {
      const livestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .getOne<LivestreamSessionRecord>(livestreamSessionId);

      return livestreamSession;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }

      console.error(
         "[Livestream Session Service] Error getting livestream session by id",
         error,
      );
      throw error;
   }
}

export async function getAllQnALivestreamSessions() {
   try {
      const livestreamSessions = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .getFullList<LivestreamSessionRecord>({
            filter: `sessionType="qna_live"`,
         });

      return livestreamSessions;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return [];
      }

      console.error(
         "[Livestream Session Service] Error getting all qna livestream sessions",
         error,
      );
      throw error;
   }
}

export async function getQnALivestreamSessionForConference(
   conferenceId: string,
) {
   try {
      const livestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .getFirstListItem<LivestreamSessionRecord>(
            `conference="${conferenceId}" && sessionType="qna_live"`,
         );

      return livestreamSession;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }

      console.error(
         "[Livestream Session Service] Error getting qna livestream session for conference",
         error,
      );
      throw error;
   }
}

export async function getQnALivestreamSessionByMuxLiveStreamId(
   muxLiveStreamId: string,
) {
   try {
      const livestreamAsset = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_MUX_LIVESTREAMS)
         .getFirstListItem<LivestreamMuxAssetRecord>(
            `muxLivestreamId = "${muxLiveStreamId}"`,
         );

      const livestreamSession = await getLivestreamSessionById(
         livestreamAsset.livestreamSession,
      );

      if (!livestreamSession) {
         console.error(
            "[Livestream Session Service] No livestream session found for mux live stream id",
            muxLiveStreamId,
         );
         return null;
      }

      console.log(
         `[Livestream Session Service] QnA livestream session ${livestreamSession?.id} found for mux live stream id ${muxLiveStreamId}`,
      );
      return livestreamSession;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }

      console.error(
         "[Livestream Session Service] Error getting qna livestream session by mux live stream id",
         error,
      );
      throw error;
   }
}

export async function checkIfConferenceHasQnALivestreamSession(
   conferenceId: string,
) {
   try {
      const livestreamSession =
         await getQnALivestreamSessionForConference(conferenceId);
      const livestreamMuxAsset =
         await getQnALivestreamMuxAssetForConference(conferenceId);

      return livestreamSession !== null && livestreamMuxAsset !== null;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error checking if conference has qna livestream session",
         error,
      );
      throw error;
   }
}

export async function updateLivestreamSessionAttendantStatus(
   livestreamSessionId: string,
   newAttendantStatus: LivestreamSession["attendantStatus"],
) {
   try {
      const updatedLivestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .update<LivestreamSessionRecord>(livestreamSessionId, {
            attendantStatus: newAttendantStatus,
         });
      console.log(
         "[Livestream Session Service] Livestream session attendant status updated successfully",
         newAttendantStatus,
      );

      return updatedLivestreamSession;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error updating livestream session attendant status",
         error,
      );
      throw error;
   }
}

export async function updateLivestreamSessionStatus(
   livestreamSessionId: string,
   newStatus: LivestreamSession["status"],
) {
   try {
      const shouldUpdateAttendantStatus = () => {
         if (newStatus === "streaming") {
            return false;
         }

         return true;
      };

      const updatedLivestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .update<LivestreamSessionRecord>(livestreamSessionId, {
            status: newStatus,
         });
      console.log(
         "[Livestream Session Service] Livestream session status updated successfully to ",
         newStatus,
      );

      if (shouldUpdateAttendantStatus()) {
         await updateLivestreamSessionAttendantStatus(
            livestreamSessionId,
            newStatus,
         );
      }

      return updatedLivestreamSession;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error updating livestream session status",
         error,
      );
      throw error;
   }
}

export async function updateLivestreamSessionZoomLink(
   livestreamSessionId: string,
   zoomLink: string,
) {
   try {
      const updatedLivestreamSession = await pbServerClient
         .collection(PB_COLLECTIONS.LIVESTREAM_SESSIONS)
         .update<LivestreamSessionRecord>(livestreamSessionId, {
            zoomEmergencyLink: zoomLink,
         });

      return updatedLivestreamSession;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error updating livestream session zoom link",
         error,
      );
      throw error;
   }
}

export async function getLivestreamSessionZoomLink(
   livestreamSessionId: string,
) {
   try {
      const livestreamSession =
         await getLivestreamSessionById(livestreamSessionId);

      return livestreamSession?.zoomEmergencyLink;
   } catch (error) {
      console.error(
         "[Livestream Session Service] Error getting livestream session zoom link",
         error,
      );
      throw error;
   }
}
