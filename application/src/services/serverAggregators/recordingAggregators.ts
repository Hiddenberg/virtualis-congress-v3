import type { RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
import type {
   ConferenceRecording,
   ConferenceVideoAsset,
} from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import "server-only";

export async function getRecordingsWithVideoAssets() {
   const recordingsWithVideoAssetsAssigned = await pbServerClient
      .collection(PB_COLLECTIONS.CONGRESS_CONFERENCE_RECORDINGS)
      .getFullList<
         ConferenceRecording &
            RecordModel & {
               expand: {
                  conference_video_assets_via_recording: (ConferenceVideoAsset &
                     RecordModel)[];
               };
            }
      >({
         filter: `conference_video_assets_via_recording.id != null`,
         expand: "conference_video_assets_via_recording",
      });

   return recordingsWithVideoAssetsAssigned.map((recordingWVideoAsset) => ({
      ...recordingWVideoAsset,
      videoAssets:
         recordingWVideoAsset.expand.conference_video_assets_via_recording,
      expand: undefined,
   }));
}
export type RecordingWithVideoAssets = Awaited<
   ReturnType<typeof getRecordingsWithVideoAssets>
>[number];
