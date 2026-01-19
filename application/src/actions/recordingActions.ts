"use server";

import pbServerClient from "@/libs/pbServerClient";
import { updateRecordingStatus } from "@/services/recordingServices";
import { ConferenceRecording } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { PerformanceMetrics } from "@/utils/performanceMetrics";

export async function addPerformanceMetricsToRecordingAction(
   recordingId: string,
   performanceMetrics: PerformanceMetrics,
) {
   try {
      const jsonMetrics = JSON.stringify(performanceMetrics);

      await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
         .update(recordingId, {
            preformanceMetrics: jsonMetrics,
         } satisfies Partial<ConferenceRecording>);

      console.log(
         "[RecordingActions] Performance metrics added to recording",
         recordingId,
      );
      return {
         success: true,
         message: "Performance metrics added to recording",
      };
   } catch (error) {
      console.error(
         "[RecordingActions] Error adding performance metrics to recording",
         error,
      );
      return {
         success: false,
         message: "Error adding performance metrics to recording",
      };
   }
}

export async function updateRecordingStatusAction(
   recordingId: string,
   status: ConferenceRecording["status"],
) {
   try {
      console.log(
         "[RecordingActions] Updating recording status",
         recordingId,
         status,
      );
      await updateRecordingStatus(recordingId, status);
      return {
         success: true,
         message: "Recording status updated",
      };
   } catch (error) {
      console.error(
         "[RecordingActions] Error updating recording status",
         error,
      );
      return {
         success: false,
         error: "Error updating recording status",
      };
   }
}
