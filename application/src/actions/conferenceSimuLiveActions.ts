"use server";

import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getConferenceRecordings } from "@/services/recordingServices";
import { getVideoAssetsForRecording } from "@/services/videoAssetsServices";

export async function getConferenceSimuLiveDataAction(conferenceId: string) {
   try {
      // Get the conference data
      const conference = await getConferenceById(conferenceId);
      if (!conference) {
         return {
            success: false,
            error: "Conference not found",
         };
      }

      // Get all recordings for this conference
      const conferenceRecordings = await getConferenceRecordings(conferenceId);
      if (!conferenceRecordings || conferenceRecordings.length === 0) {
         return {
            success: false,
            error: "No recordings found for this conference",
         };
      }

      // Separate presentation and conference recordings
      const presentationRecording = conferenceRecordings.find(
         (recording) =>
            recording.recordingType === "presentation" &&
            recording.status === "available",
      );

      const conferenceRecording = conferenceRecordings.find(
         (recording) =>
            (recording.recordingType === "conference" ||
               recording.recordingType === "group_conference") &&
            recording.status === "available",
      );

      if (!presentationRecording) {
         console.log("No presentation recording found");
      }

      if (!conferenceRecording) {
         return {
            success: false,
            error: "Conference recording not available",
         };
      }

      if (conferenceRecording.durationSeconds === 0) {
         return {
            success: false,
            error: "Conference recording duration is 0",
         };
      }

      // Get video assets for both recordings
      const presentationVideoAssets = presentationRecording
         ? await getVideoAssetsForRecording(presentationRecording.id)
         : [];
      const conferenceVideoAssets = await getVideoAssetsForRecording(
         conferenceRecording.id,
      );

      // Filter only "ready" assets that have a playback ID
      const readyPresentationAssets = presentationVideoAssets.filter(
         (asset) =>
            asset.muxAssetId !== undefined && asset.muxPlaybackId !== undefined,
      );

      const readyConferenceAssets = conferenceVideoAssets.filter(
         (asset) =>
            asset.muxAssetId !== undefined && asset.muxPlaybackId !== undefined,
      );

      if (readyPresentationAssets.length === 0) {
         console.log("No ready presentation video assets found");
      }

      if (readyConferenceAssets.length === 0) {
         return {
            success: false,
            error: "No ready conference video assets found",
         };
      }

      return {
         success: true,
         data: {
            conference,
            presentationMuxAssets: readyPresentationAssets,
            conferenceMuxAssets: readyConferenceAssets,
            presentationDuration: presentationRecording
               ? presentationRecording.durationSeconds
               : 0,
            conferenceDuration: conferenceRecording.durationSeconds,
         },
      };
   } catch (error) {
      console.error("[ConferenceSimuLiveActions] Error fetching data:", error);
      return {
         success: false,
         error: "An unexpected error occurred",
      };
   }
}
