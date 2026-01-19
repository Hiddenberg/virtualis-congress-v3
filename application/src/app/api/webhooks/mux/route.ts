import { Asset } from "@mux/mux-node/resources/video/assets.mjs";
import { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { NextRequest, NextResponse } from "next/server";
import {
   getGlobalLivestreamSessionByMuxLivestreamId,
   updateLivestreamSessionAttendantStatus,
   updateLivestreamSessionStatus,
} from "@/features/livestreams/services/livestreamSessionServices";
import { getRecordingLivestreamRecordByLivestreamSessionId } from "@/features/simpleRecordings/services/recordingLivestreamServices";
import {
   getGlobalSimpleRecordingByMuxAssetId,
   updateSimpleRecording,
} from "@/features/simpleRecordings/services/recordingsServices";
import mux from "@/libs/mux";
import { getMuxAssetById } from "@/services/muxServices";

async function processMuxWebhook(muxWebhook: UnwrapWebhookEvent) {
   const allowedWebhooks: UnwrapWebhookEvent["type"][] = [
      "video.asset.created",
      "video.asset.ready",
      "video.asset.errored",
      "video.asset.deleted",
      "video.asset.updated",
      "video.upload.errored",
      "video.upload.cancelled",
      "video.upload.asset_created",
      "video.live_stream.recording",
      "video.live_stream.active",
      "video.live_stream.idle",
      "video.live_stream.disconnected",
      "video.live_stream.connected",
      "video.asset.live_stream_completed",
      "video.asset.track.created",
      "video.asset.static_rendition.created",
      "video.asset.static_rendition.ready",
      "video.asset.static_rendition.errored",
   ];

   if (!allowedWebhooks.includes(muxWebhook.type)) {
      console.log("[processMuxWebhook] Unhandled webhook", muxWebhook.type);
      return;
   }

   if (muxWebhook.type === "video.asset.created") {
      console.log(
         "[processMuxWebhook] Video asset created",
         muxWebhook.data.id,
      );
      console.log(muxWebhook.data);
      return;
   }

   if (muxWebhook.type === "video.asset.ready") {
      console.log("[processMuxWebhook] Video asset ready", muxWebhook.data.id);
      const muxAssetData = muxWebhook.data;

      console.log("[processMuxWebhook] Mux asset data", muxAssetData);

      // Only change the status to ready if the asset is from a direct upload
      // Since livestreams also trigger this webhook, we need to check the ingest type to avoid updating the status to ready for livestreams
      // until the livestream is completed
      if (muxAssetData.ingest_type === "on_demand_direct_upload") {
         console.log(
            "[processMuxWebhook] Mux asset is from a direct upload, updating simple recording status to ready",
         );
         // check if the mux asset is from a simple recording and update the simple recording with the playback id
         const simpleRecording = await getGlobalSimpleRecordingByMuxAssetId(
            muxAssetData.id,
         );
         if (simpleRecording) {
            console.log(
               "[processMuxWebhook] Simple recording found for mux asset",
               muxAssetData.id,
            );

            const playbackId = muxAssetData.playback_ids?.[0].id;

            if (!playbackId) {
               console.log(
                  "[processMuxWebhook] No playback id found for mux asset",
                  muxAssetData.id,
               );
               return;
            }

            await updateSimpleRecording(simpleRecording.id, {
               status: "ready",
               muxPlaybackId: playbackId,
               durationSeconds: muxAssetData.duration ?? 0,
            });

            console.log(
               "[processMuxWebhook] Simple recording updated with playback id",
               playbackId,
            );
            return;
         }
      }

      return;
   }

   if (muxWebhook.type === "video.asset.errored") {
      console.log("[processMuxWebhook] Video asset failed", muxWebhook.data.id);

      const muxAssetId = muxWebhook.data.id;

      const simpleRecording =
         await getGlobalSimpleRecordingByMuxAssetId(muxAssetId);
      if (simpleRecording) {
         console.log(
            "[processMuxWebhook] Simple recording found for mux asset",
            muxAssetId,
         );
         await updateSimpleRecording(simpleRecording.id, {
            status: "error",
            errorMessage:
               muxWebhook.data.errors?.messages?.join(", ") ?? "Unknown error",
         });
         console.log(
            "[processMuxWebhook] Simple recording updated with error message",
            muxWebhook.data.errors?.messages?.join(", ") ?? "Unknown error",
         );
      }

      return;
   }

   if (muxWebhook.type === "video.asset.deleted") {
      console.log(
         "[processMuxWebhook] Video asset deleted",
         muxWebhook.data.id,
      );
      return;
   }

   if (muxWebhook.type === "video.asset.updated") {
      console.log(
         "[processMuxWebhook] Video asset updated",
         muxWebhook.data.id,
      );
      return;
   }

   // ordered live stream webhooks
   if (muxWebhook.type === "video.live_stream.connected") {
      // This event indicates that the streamer's broadcasting software or hardware has successfully connected to Mux servers.
      // However, video is not yet being recorded or playable.
      const muxLivestreamId = muxWebhook.data.id;
      console.log("[processMuxWebhook] Live stream connected", muxLivestreamId);

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);
      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook] Livestream session not found for mux livestream: ",
            muxLivestreamId,
         );
         return;
      }

      // Update the livestream session status to streaming if the attendant status is paused
      if (livestreamSession.attendantStatus === "paused") {
         console.log(
            "[processMuxWebhook] Live stream connected and attendant is paused, updating livestream statuses to streaming",
         );
         await updateLivestreamSessionStatus(livestreamSession.id, "streaming");
         await updateLivestreamSessionAttendantStatus(
            livestreamSession.id,
            "streaming",
         );
         console.log(
            "[processMuxWebhook] Statuses updated to streaming successfully",
         );
      }
      return;
   }

   if (muxWebhook.type === "video.live_stream.recording") {
      const muxLivestreamId = muxWebhook.data.id;
      console.log("[processMuxWebhook] Live stream recording", muxLivestreamId);

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);
      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook] Livestream session not found for mux livestream: ",
            muxLivestreamId,
         );
         return;
      }

      // check if the livestream session is from a recording
      const recordingLivestream =
         await getRecordingLivestreamRecordByLivestreamSessionId({
            organizationId: livestreamSession.organization,
            livestreamSessionId: livestreamSession.id,
         });

      if (recordingLivestream) {
         console.log(
            `[processMuxWebhook] Livestream session ${livestreamSession.id} is from a recording, updating recording status to recording`,
         );

         const muxAssetId = muxWebhook.data.active_asset_id;
         if (!muxAssetId) {
            await updateSimpleRecording(recordingLivestream.recording, {
               status: "error",
               errorMessage: "No mux asset id found for mux livestream",
            });

            console.error(
               `[processMuxWebhook] No mux asset id found for mux livestream: ${muxLivestreamId}`,
            );
            return;
         }

         await updateSimpleRecording(recordingLivestream.recording, {
            status: "recording",
            muxAssetId: muxAssetId,
         });
         return;
      }

      return;
   }

   if (muxWebhook.type === "video.live_stream.active") {
      const muxLivestreamId = muxWebhook.data.id;
      console.log("[processMuxWebhook] Live stream active", muxLivestreamId);

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);

      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook] Livestream session not found",
            muxLivestreamId,
         );
         return;
      }

      await updateLivestreamSessionAttendantStatus(
         livestreamSession.id,
         "streaming",
      );
      return;
   }

   if (muxWebhook.type === "video.live_stream.disconnected") {
      const muxLivestreamId = muxWebhook.data.id;
      console.log(
         "[processMuxWebhook] Live stream disconnected",
         muxLivestreamId,
      );

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);

      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook] Livestream session not found",
            muxLivestreamId,
         );
         return;
      }

      if (
         livestreamSession.status === "streaming" ||
         livestreamSession.attendantStatus === "streaming"
      ) {
         console.log(
            "[processMuxWebhook] Live stream disconnected while streaming, updating livestream statuses to paused",
         );
         await updateLivestreamSessionStatus(livestreamSession.id, "paused");
         await updateLivestreamSessionAttendantStatus(
            livestreamSession.id,
            "paused",
         );
         console.log(
            "[processMuxWebhook] Statuses updated to paused successfully",
         );
      }
      return;
   }

   if (muxWebhook.type === "video.live_stream.idle") {
      const muxLivestreamId = muxWebhook.data.id;
      console.log("[processMuxWebhook] Live stream idle", muxLivestreamId);

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);

      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook] Livestream session not found",
            muxLivestreamId,
         );
         return;
      }

      if (livestreamSession.status === "paused") {
         console.log(
            "[processMuxWebhook] Live stream changed to idle while paused, updating livestream statuses to ended",
         );
         await updateLivestreamSessionStatus(livestreamSession.id, "ended");
         await updateLivestreamSessionAttendantStatus(
            livestreamSession.id,
            "ended",
         );
         console.log(
            "[processMuxWebhook] Statuses updated to ended successfully",
         );
      }
      return;
   }

   if (muxWebhook.type === "video.asset.live_stream_completed") {
      console.log(
         "[processMuxWebhook:video.asset.live_stream_completed]  Live stream completed",
         muxWebhook.data.id,
      );
      console.log(
         "[processMuxWebhook:video.asset.live_stream_completed] Mux webhook data",
         muxWebhook.data,
      );

      const muxLivestreamId = muxWebhook.data.live_stream_id;
      if (!muxLivestreamId) {
         console.error(
            "[processMuxWebhook:video.asset.live_stream_completed] No mux livestream id found for mux webhook",
         );
         return;
      }

      const livestreamSession =
         await getGlobalLivestreamSessionByMuxLivestreamId(muxLivestreamId);
      if (!livestreamSession) {
         console.log(
            "[processMuxWebhook:video.asset.live_stream_completed] Livestream session not found for mux livestream: ",
            muxLivestreamId,
         );
         return;
      }

      const muxAssetId = muxWebhook.data.id;

      if (!muxAssetId) {
         console.error(
            "[processMuxWebhook:video.asset.live_stream_completed] No mux asset id found for mux webhook",
         );
         return;
      }

      const muxAsset = await getMuxAssetById(muxAssetId);

      if (!muxAsset) {
         console.error(
            "[processMuxWebhook:video.asset.live_stream_completed] Mux asset not found for mux webhook",
         );
         return;
      }

      // check if the livestream session is from a recording
      const recordingLivestream =
         await getRecordingLivestreamRecordByLivestreamSessionId({
            organizationId: livestreamSession.organization,
            livestreamSessionId: livestreamSession.id,
         });
      if (recordingLivestream) {
         console.log(
            `[processMuxWebhook:video.asset.live_stream_completed] Livestream session ${livestreamSession.id} is from a recording, updating recording status to processing`,
         );

         const muxPlaybackId = muxAsset.playback_ids?.[0].id;

         if (!muxPlaybackId) {
            console.error(
               "[processMuxWebhook:video.asset.live_stream_completed] No mux playback id found for mux webhook",
            );
            return;
         }

         await updateSimpleRecording(recordingLivestream.recording, {
            status: "reviewing",
            muxPlaybackId: muxPlaybackId,
         });

         return;
      }
      return;
   }

   if (muxWebhook.type === "video.asset.static_rendition.created") {
      console.log(
         "[processMuxWebhook:video.asset.static_rendition.created] Static rendition created",
         muxWebhook.data.id,
      );

      const staticRendition = muxWebhook.data as Asset.StaticRenditions.File & {
         asset_id?: string;
      };

      if (!staticRendition.asset_id) {
         console.error(
            "[processMuxWebhook:video.asset.static_rendition.created] No asset id found for static rendition",
            staticRendition.id,
         );
         return;
      }

      const muxAsset = await getMuxAssetById(staticRendition.asset_id);

      if (!muxAsset) {
         console.error(
            "[processMuxWebhook:video.asset.static_rendition.created] Mux asset not found for static rendition",
            staticRendition.id,
         );
         return;
      }

      // check if the static rendition is from a simple recording
      const simpleRecording = await getGlobalSimpleRecordingByMuxAssetId(
         staticRendition.asset_id,
      );
      if (simpleRecording) {
         console.log(
            `[processMuxWebhook:video.asset.static_rendition.created] Static rendition ${staticRendition.id} is from a simple recording`,
         );

         const downloadURL = `https://stream.mux.com/${muxAsset.playback_ids?.[0].id}/${staticRendition.name}?download=${simpleRecording.title}.mp4`;

         await updateSimpleRecording(simpleRecording.id, {
            status: "ready",
            muxPlaybackId: muxAsset.playback_ids?.[0].id,
            muxDownloadURL: downloadURL,
         });

         console.log(
            `[processMuxWebhook:video.asset.static_rendition.created] Static rendition ${staticRendition.id} is from a simple recording, updating recording status to ready`,
         );
         return;
      }

      return;
   }
}

export async function POST(request: NextRequest) {
   const muxSignature = request.headers.get("Mux-Signature");
   const textBody = await request.text();

   // Check if the signature is present
   if (!muxSignature) {
      return NextResponse.json(
         {
            message: "No Mux signature found",
         },
         {
            status: 400,
         },
      );
   }

   // Verify the signature
   try {
      mux.webhooks.verifySignature(
         textBody,
         request.headers,
         process.env.MUX_WEBHOOK_SECRET,
      );
   } catch (error) {
      console.error("[POST MUX webhook] Signature verification failed", error);
      return NextResponse.json(
         {
            message: "Signature verification failed",
         },
         {
            status: 400,
         },
      );
   }

   const unwrappedWebhook = mux.webhooks.unwrap(textBody, request.headers);

   // Start processing the webhook asynchronously
   processMuxWebhook(unwrappedWebhook);

   // Return a success response
   return NextResponse.json(
      {
         message: "Webhook received",
      },
      {
         status: 200,
      },
   );
}
