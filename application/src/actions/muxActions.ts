"use server";

import type { RecordModel } from "pocketbase";
import mux from "@/libs/mux";
import type { ConferenceRecording } from "@/types/congress";

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
