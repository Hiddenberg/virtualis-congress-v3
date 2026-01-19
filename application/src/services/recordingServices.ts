import { ClientResponseError, RecordModel } from "pocketbase";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import pbServerClient from "@/libs/pbServerClient";
import { ConferenceRecording } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";
import { PerformanceMetrics } from "@/utils/performanceMetrics";
import { getAllCongressConferences } from "../features/conferences/services/conferenceServices";
import { getMuxAssetById } from "./muxServices";
import { getVideoAssetsForRecording } from "./videoAssetsServices";

export async function createNewConferenceRecordings(
   conference: CongressConference & RecordModel,
) {
   const baseRecordingUrl =
      process.env.NODE_ENV === "development"
         ? "http://localhost:3000"
         : "https://acp-congress.virtualis.app";

   const newConferenceRecording: ConferenceRecording = {
      organization: TEMP_CONSTANTS.ORGANIZATION_ID,
      conference: conference.id,
      status: "pending",
      recordingUrl: "TEMP",
      recordingType: "conference",
      durationSeconds: 0,
      usersWhoWillRecord: conference.speakers,
      invitationEmailSent: false,
      invitationEmailOpened: false,
      remindersSentCount: 0,
   };

   const newPresentationRecording: ConferenceRecording = {
      ...newConferenceRecording,
      usersWhoWillRecord: [],
      recordingUrl: "TEMP",
      recordingType: "presentation",
   };

   const conferenceRecordingCreated = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .create<ConferenceRecording & RecordModel>(newConferenceRecording);
   const presentationRecordingCreated = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .create<ConferenceRecording & RecordModel>(newPresentationRecording);

   await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .update(conferenceRecordingCreated.id, {
         recordingUrl: `${baseRecordingUrl}/speakers/recording/${conferenceRecordingCreated.id}/conference`,
      });
   await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .update(presentationRecordingCreated.id, {
         recordingUrl: `${baseRecordingUrl}/speakers/recording/${presentationRecordingCreated.id}/presentation`,
      });

   console.log("recordings created for conference: ", conference.id);
   return {
      conferenceRecordingCreated,
      presentationRecordingCreated,
   };
}

export async function getConferenceRecordings(conferenceId: string) {
   try {
      const conferenceRecordings = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getFullList<ConferenceRecording & RecordModel>({
            filter: `conference = "${conferenceId}"`,
         });

      return conferenceRecordings;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function getRecordingById(recordingId: string) {
   try {
      const conferenceRecording = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getOne<ConferenceRecording & RecordModel>(recordingId);

      return conferenceRecording;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export type ExpandedRecording = ConferenceRecording &
   RecordModel & {
      expand: {
         conference: CongressConference & RecordModel;
         usersWhoWillRecord?: (User & RecordModel)[];
      };
   };
export async function getExpandedRecordingById(recordingId: string) {
   try {
      const conferenceRecording = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .getOne<ExpandedRecording>(recordingId, {
            expand: "conference, usersWhoWillRecord",
         });

      return conferenceRecording;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function getAllCongressRecordings(congressId: string) {
   const filter = `conference.congress = "${congressId}"`;
   const allConferenceRecordings = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .getFullList<ConferenceRecording & RecordModel>({
         filter,
      });

   return allConferenceRecordings;
}

export async function getAllConferenceRecordingsWithoutUsers(
   congressId: string,
) {
   const filter = `conference.congress = "${congressId}" && usersWhoWillRecord = "[]" && recordingType = "conference"`;
   const allConferenceRecordings = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .getFullList<ConferenceRecording & RecordModel>({
         filter,
      });

   return allConferenceRecordings;
}

export async function updateRecordingStatus(
   recordingId: string,
   status: ConferenceRecording["status"],
) {
   try {
      const statusLogMessages: Record<ConferenceRecording["status"], string> = {
         pending: `Recording ${recordingId} is pending`,
         recording: `Started recording for recordingId: ${recordingId}`,
         uploading: `Uploading recording ${recordingId}`,
         processing: `Processing recording ${recordingId}`,
         available: `Recording ${recordingId} is now available`,
         failed: `Recording ${recordingId} failed`,
      };
      console.log(`[updateRecordingStatus] ${statusLogMessages[status]}`);

      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            status,
            startedRecordingAt:
               status === "recording" ? new Date().toISOString() : undefined,
         } satisfies Partial<ConferenceRecording>);
   } catch (error) {
      console.error("Error updating recording status: ", error);
      throw error;
   }
}

export async function updateRecordingDuration(
   recordingId: string,
   newDuration: number,
) {
   try {
      console.log(
         `[RecordingServices] Started updating recording duration for ${recordingId} to ${newDuration}`,
      );
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            durationSeconds: newDuration,
         } satisfies Partial<ConferenceRecording>);
      console.log(
         `[RecordingServices] Updated recording duration for ${recordingId} to ${newDuration}`,
      );
   } catch (error) {
      console.error("Error updating recording duration: ", error);
      throw error;
   }
}

export async function updateRecordingDurationFromMuxData(recordingId: string) {
   try {
      const recordingVideoAssets =
         await getVideoAssetsForRecording(recordingId);

      if (recordingVideoAssets.length === 0) {
         console.error(
            `[RecordingServices] No video assets found for recording ${recordingId} so we can't update the duration`,
         );
         return;
      }

      const videoAssetsWithDuration = [];
      for (const videoAsset of recordingVideoAssets) {
         if (!videoAsset.muxAssetId) {
            throw new Error(
               `[RecordingServices] No video asset id found in the DB for video asset ${videoAsset.id}`,
            );
         }

         const muxAsset = await getMuxAssetById(videoAsset.muxAssetId);

         if (!muxAsset) {
            throw new Error(
               `[RecordingServices] No mux asset found for video asset ${videoAsset.id}`,
            );
         }

         videoAssetsWithDuration.push({
            ...videoAsset,
            duration: muxAsset.duration,
         });
      }

      const minDuration = Math.min(
         ...videoAssetsWithDuration.map((asset) => asset?.duration ?? 0),
      );
      const flooredDuration = Math.floor(minDuration);

      await updateRecordingDuration(recordingId, flooredDuration);
   } catch (error) {
      console.error("Error updating recording duration from mux data: ", error);
      throw error;
   }
}

export async function updateRecordingDate(recordingId: string) {
   try {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            recordedAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording>);
   } catch (error) {
      console.error("Error updating uploaded recording: ", error);
      throw error;
   }
}

export async function updateRecordingInvitationSentStatus(
   recordingId: string,
   status: boolean,
) {
   try {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            invitationEmailSent: status,
            lastReminderSentAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording>);
   } catch (error) {
      console.error("Error updating recording invitation sent status: ", error);
      throw error;
   }
}

export async function updateRecordingInvitationOpenedStatus(
   recordingId: string,
   status: boolean,
) {
   try {
      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            invitationEmailOpened: status,
            invitationEmailOpenedAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording>);
   } catch (error) {
      console.error(
         "Error updating recording invitation opened status: ",
         error,
      );
      throw error;
   }
}

export async function addRecordingReminderCount(recordingId: string) {
   try {
      const recording = await getRecordingById(recordingId);

      if (!recording) {
         throw new Error(
            `Recording ${recordingId} not found when adding reminder count`,
         );
      }

      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            remindersSentCount: recording.remindersSentCount + 1,
            lastReminderSentAt: new Date().toISOString(),
         } satisfies Partial<ConferenceRecording>);
   } catch (error) {
      console.error("Error adding recording reminder count: ", error);
      throw error;
   }
}

export async function updateAllRecordingUsersAssigned() {
   const allConferences = await getAllCongressConferences(
      TEMP_CONSTANTS.CONGRESS_ID,
   );
   const conferenceRecordingsWithoutUsers =
      await getAllConferenceRecordingsWithoutUsers(TEMP_CONSTANTS.CONGRESS_ID);

   let recordingsUpdated = 0;
   for (const recordingWithoutUsers of conferenceRecordingsWithoutUsers) {
      const conferenceForThisRecording = allConferences.find(
         (conference) => conference.id === recordingWithoutUsers.conference,
      );

      if (!conferenceForThisRecording) {
         console.log(
            "No conference found for recording: ",
            recordingWithoutUsers.id,
         );
         continue;
      }

      // REFACTOR: This is a temporary fix to allow the updateAllRecordingUsersAssigned to work
      // const speakersForThisConference = conferenceForThisRecording.speakers

      // await pbServerClient.collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      //    .update(recordingWithoutUsers.id, {
      //       usersWhoWillRecord: speakersForThisConference,
      //       recordingType: speakersForThisConference.length > 1 ? "group_conference" : "conference"
      //    })

      recordingsUpdated++;
   }

   return recordingsUpdated;
}

export async function checkIfRecordingWasCompleted(recordingId: string) {
   const recording = await getRecordingById(recordingId);

   if (!recording) {
      return null;
   }

   if (recording.status === "available") {
      return true;
   }

   return false;
}

export async function checkIfRecordingHadScreenShare(recordingId: string) {
   const recording = await getRecordingById(recordingId);

   if (!recording) {
      throw new Error(
         `Recording ${recordingId} not found when checking if recording requires screen`,
      );
   }

   // The performance metrics are stored as a JSON string, so we need to parse it
   // Also added null check and default value in case metrics aren't available
   try {
      const performanceMetrics =
         typeof recording.preformanceMetrics === "string"
            ? JSON.parse(recording.preformanceMetrics)
            : (recording.preformanceMetrics as unknown as PerformanceMetrics);

      console.log(
         `[checkIfRecordingHadScreenShare] Recording ${recordingId} screen sharing status:`,
         performanceMetrics?.isSharingScreen || false,
      );

      return performanceMetrics?.isSharingScreen || false;
   } catch (error) {
      console.error(
         `Error parsing performance metrics for recording ${recordingId}:`,
         error,
      );
      return false;
   }
}

export async function checkIfRecordingHasVideoAssetsNeededReady(
   recordingId: string,
) {
   const recordingVideoAssets = await getVideoAssetsForRecording(recordingId);
   const requiresScreen = await checkIfRecordingHadScreenShare(recordingId);

   console.log(
      `[checkIfRecordingHasVideoAssetsNeededReady] Recording ${recordingId} has ${recordingVideoAssets.length} video assets`,
   );
   console.log(
      `[checkIfRecordingHasVideoAssetsNeededReady] Recording ${recordingId} requires screen: ${requiresScreen}`,
   );

   // Log all video assets for debugging
   recordingVideoAssets.forEach((asset) => {
      console.log(
         `[checkIfRecordingHasVideoAssetsNeededReady] Video asset: type=${asset.videoType}, status=${asset.muxAssetStatus}`,
      );
   });

   // we need to check if the recording has a combined video OR if it has a camera and screen video (when screen sharing was used)
   const hasCombinedVideo =
      recordingVideoAssets.length === 1 &&
      recordingVideoAssets[0].videoType === "combined" &&
      recordingVideoAssets[0].muxAssetStatus === "ready";

   const hasCameraVideo = recordingVideoAssets.some(
      (asset) =>
         asset.videoType === "camera" && asset.muxAssetStatus === "ready",
   );

   const hasScreenVideo = recordingVideoAssets.some(
      (asset) =>
         asset.videoType === "screen" && asset.muxAssetStatus === "ready",
   );

   console.log(
      `[checkIfRecordingHasVideoAssetsNeededReady] hasCombinedVideo: ${hasCombinedVideo}, hasCameraVideo: ${hasCameraVideo}, hasScreenVideo: ${hasScreenVideo}`,
   );

   // If screen sharing was used, we need both camera and screen videos
   // If screen sharing was not used, we only need the camera video
   const result =
      hasCombinedVideo ||
      (hasCameraVideo && (!requiresScreen || hasScreenVideo));
   console.log(
      `[checkIfRecordingHasVideoAssetsNeededReady] Final result: ${result}`,
   );

   return result;
}

export async function updateReRecordingEmailSentStatus(
   recordingId: string,
   status: boolean,
) {
   await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .update(recordingId, {
         reRecordingEmailSent: status,
         reRecordingEmailSentAt: new Date().toISOString(),
      } satisfies Partial<ConferenceRecording>);
}
