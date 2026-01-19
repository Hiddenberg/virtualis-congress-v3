// import { getGlobalSimpleRecordingByMuxAssetId, updateSimpleRecording } from "@/features/simpleRecordings/services/recordingsServices";
// import mux from "@/libs/mux";
// import { sendRecordingCompletedEmail } from "@/services/emailServices";
// import { getQnALivestreamSessionByMuxLiveStreamId, updateLivestreamSessionAttendantStatus } from "@/services/livestreamSessionServices";
// import { getMuxAssetById } from "@/services/muxServices";
// import {
//    checkIfRecordingHadScreenShare, checkIfRecordingHasVideoAssetsNeededReady, updateRecordingStatus
// } from "@/services/recordingServices";
// import {
//    getVideoAssetByMuxAssetId, getVideoAssetByMuxUploadId, getVideoAssetsForRecording, updateVideoAssetStatus
// } from "@/services/videoAssetsServices";
// import { Asset } from "@mux/mux-node/resources/video/assets.mjs";
// import { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
// import { NextRequest, NextResponse } from "next/server";

// async function processMuxWebhook (muxWebhook: UnwrapWebhookEvent) {
//    const allowedWebhooks: UnwrapWebhookEvent["type"][] = [
//       "video.asset.created",
//       "video.asset.ready",
//       "video.asset.errored",
//       "video.asset.deleted",
//       "video.asset.updated",
//       "video.asset.static_rendition.ready" as UnwrapWebhookEvent["type"],
//       "video.asset.static_rendition.errored" as UnwrapWebhookEvent["type"],
//       "video.upload.errored",
//       "video.upload.cancelled",
//       "video.upload.asset_created",
//       "video.live_stream.active",
//       "video.live_stream.idle",
//       "video.asset.track.created"
//    ]

//    if (!allowedWebhooks.includes(muxWebhook.type)) {
//       console.log("Unhandled webhook", muxWebhook.type)
//       return
//    }

//    if (muxWebhook.type === "video.asset.static_rendition.ready") {
//       console.log("[MuxWebhook] Video asset static rendition ready", muxWebhook.data.id)

//       console.log(muxWebhook.data)

//       const staticRendition = muxWebhook.data as unknown as Asset.StaticRenditions.File & { asset_id: string }

//       const muxAsset = await getMuxAssetById(staticRendition.asset_id)

//       if (!muxAsset) {
//          console.error("[MuxWebhook] Mux asset not found", staticRendition.asset_id)
//          return
//       }

//       const simpleRecording = await getGlobalSimpleRecordingByMuxAssetId(muxAsset.id)

//       if (!simpleRecording) {
//          console.error("[MuxWebhook] Simple recording not found for mux asset", staticRendition.id)
//          return
//       }

//       const playbackId = muxAsset.playback_ids?.[0].id

//       if (!playbackId) {
//          console.error("[MuxWebhook] Playback id not found for mux asset", staticRendition.id)
//          await updateSimpleRecording(simpleRecording.id, {
//             status: "error",
//             errorMessage: "Playback id not found for mux asset",
//          })
//          return
//       }

//       const downloadURL = `https://stream.mux.com/${playbackId}/${staticRendition.name}?download=${simpleRecording.title}.mp4`

//       await updateSimpleRecording(simpleRecording.id, {
//          status: "ready",
//          muxPlaybackId: playbackId,
//          muxDownloadURL: downloadURL,
//       })
//       console.log("[MuxWebhook] Recording status updated to ready", simpleRecording.id)
//       return
//    }

//    if (muxWebhook.type === "video.asset.track.ready") {
//       console.log("[MuxWebhook] Video asset track created", muxWebhook.data.id)
//       console.log(muxWebhook.data.type)
//       console.log(muxWebhook.data.passthrough)
//       console.log(muxWebhook.data)
//       return
//    }

//    if (muxWebhook.type === "video.live_stream.active") {
//       console.log("[MuxWebhook] Live stream active", muxWebhook.data.id)

//       const livestreamSession = await getQnALivestreamSessionByMuxLiveStreamId(muxWebhook.data.id)

//       if (!livestreamSession) {
//          console.error("[MuxWebhook] No livestream session found for mux live stream id", muxWebhook.data.id)
//          return
//       }

//       await updateLivestreamSessionAttendantStatus(livestreamSession.id, "streaming")
//       console.log("[MuxWebhook] Livestream session attendant status updated to streaming", livestreamSession.id)

//       return
//    }

//    // if (muxWebhook.type === "video.live_stream.idle") {
//    //    console.log("[MuxWebhook] Live stream idle", muxWebhook.data.id)

//    //    const livestreamSession = await getQnALivestreamSessionByMuxLiveStreamId(muxWebhook.data.id)

//    //    if (!livestreamSession) {
//    //       console.error("[MuxWebhook] No livestream session found for mux live stream id", muxWebhook.data.id)
//    //       return
//    //    }

//    //    await updateLivestreamSessionAttendantStatus(livestreamSession.id, "ended")
//    //    console.log("[MuxWebhook] Livestream session attendant status updated to ended", livestreamSession.id)

//    //    return
//    // }

//    if (muxWebhook.type === "video.upload.errored") {
//       console.log("[MuxWebhook] Video upload failed", muxWebhook.data.error)

//       const muxUploadId = muxWebhook.data.id
//       const videoAsset = await getVideoAssetByMuxUploadId(muxUploadId)

//       if (!videoAsset) {
//          console.error("[MuxWebhook] Video asset not found", muxUploadId)
//          return
//       }

//       // Update the video asset status
//       await updateVideoAssetStatus(videoAsset.id, "errored")
//       // Update the recording status
//       await updateRecordingStatus(videoAsset.recording, "failed")

//       return
//    }

//    if (muxWebhook.type === "video.upload.cancelled") {
//       console.log("[MuxWebhook] Video upload cancelled", muxWebhook.data.id)

//       const muxUploadId = muxWebhook.data.id
//       const videoAsset = await getVideoAssetByMuxUploadId(muxUploadId)

//       if (!videoAsset) {
//          console.error("[MuxWebhook] Video asset not found", muxUploadId)
//          return
//       }

//       // Update the video asset status
//       await updateVideoAssetStatus(videoAsset.id, "errored")

//       // Update the recording status
//       await updateRecordingStatus(videoAsset.recording, "failed")

//       return
//    }

//    if (muxWebhook.type === "video.asset.created") {
//       console.log("[MuxWebhook] Video asset created", muxWebhook.data.id)
//       const videoAsset = await getVideoAssetByMuxAssetId(muxWebhook.data.id)

//       if (!videoAsset) {
//          console.log("[MuxWebhook] Video asset not found", muxWebhook.data.id)
//          return
//       }

//       await updateVideoAssetStatus(videoAsset.id, "preparing")

//       // Check if this is the first video asset for the recording
//       const allVideoAssetsForRecording = await getVideoAssetsForRecording(videoAsset.recording)

//       // If this is the first video asset for the recording and it's a combined video, update the recording status
//       if (allVideoAssetsForRecording.length === 1) {
//          console.log("[MuxWebhook] First video asset for recording", videoAsset.recording, videoAsset.videoType)
//          // Update the recording status if it's a combined video

//          if (videoAsset.videoType === "combined") {
//             await updateRecordingStatus(videoAsset.recording, "processing")
//             console.log("[MuxWebhook] Recording status updated to processing", videoAsset.recording)
//             return
//          }

//          const requiresScreen = await checkIfRecordingHadScreenShare(videoAsset.recording)

//          if (!requiresScreen) {
//             if (videoAsset.videoType === "screen") {
//                console.error(`[MuxWebhook] Recording ${videoAsset.recording} has a screen video asset but no screen share was needed`)
//                return
//             }

//             if (videoAsset.videoType === "camera") {
//                await updateRecordingStatus(videoAsset.recording, "processing")
//                return
//             }
//          }
//       }

//       // If it's not a combined video and there are two video assets for the recording, update the recording status
//       if (allVideoAssetsForRecording.length === 2) {
//          // Update the recording status
//          await updateRecordingStatus(videoAsset.recording, "processing")
//          console.log("[MuxWebhook] Recording status updated to processing since it's the second video asset", videoAsset.recording)
//          return
//       }

//       return
//    }

//    if (muxWebhook.type === "video.asset.ready") {
//       console.log("Video asset ready", muxWebhook.data.id)
//       const muxAssetData = muxWebhook.data

//       // Logic specific to simple recordings
//       const simpleRecording = await getGlobalSimpleRecordingByMuxAssetId(muxAssetData.id)
//       if (simpleRecording) {
//          console.log("[MuxWebhook] Simple recording found, not doing anything in the asset ready webhook", simpleRecording.id)
//          return
//       }
//       // ----- End of logic specific to simple recordings -----

//       const videoAsset = await getVideoAssetByMuxAssetId(muxAssetData.id)

//       if (!videoAsset) {
//          console.log("Video asset not found", muxAssetData.id)
//          return
//       }

//       // Update the video asset status
//       await updateVideoAssetStatus(videoAsset.id, "ready")

//       // Check if the conference has both videos ready
//       const allVideoAssetsReady = await checkIfRecordingHasVideoAssetsNeededReady(videoAsset.recording)
//       console.log(`[MuxWebhook] ${allVideoAssetsReady ? "All video assets ready" : "Video assets not ready"} for recording ${videoAsset.recording}`)

//       if (allVideoAssetsReady) {
//          await updateRecordingStatus(videoAsset.recording, "available")
//          console.log("[MuxWebhook] Recording status updated to available", videoAsset.recording)
//          await sendRecordingCompletedEmail(videoAsset.recording)
//          console.log("[MuxWebhook] Recording completed email sent", videoAsset.recording)
//       }
//       return
//    }

//    if (muxWebhook.type === "video.asset.errored") {
//       console.log("[MuxWebhook] Video asset failed", muxWebhook.data.id)
//       const videoAsset = await getVideoAssetByMuxAssetId(muxWebhook.data.id)

//       if (!videoAsset) {
//          console.log("[MuxWebhook] Video asset not found", muxWebhook.data.id)
//          return
//       }

//       // Update the video asset status
//       await updateVideoAssetStatus(videoAsset.id, "errored")

//       // Update the recording status
//       await updateRecordingStatus(videoAsset.recording, "failed")

//       console.log("[MuxWebhook] Recording status updated to failed", videoAsset.recording)

//       return
//    }

//    if (muxWebhook.type === "video.asset.deleted") {
//       console.log("[MuxWebhook] Video asset deleted", muxWebhook.data.id)
//       return
//    }

//    if (muxWebhook.type === "video.asset.updated") {
//       console.log("[MuxWebhook] Video asset updated", muxWebhook.data.id)
//       return
//    }
// }

// export async function POST (request: NextRequest) {
//    const muxSignature = request.headers.get("Mux-Signature")
//    const textBody = await request.text()

//    // Check if the signature is present
//    if (!muxSignature) {
//       return NextResponse.json({
//          message: "No Mux signature found"
//       }, {
//          status: 400
//       })
//    }

//    // Verify the signature
//    try {
//       mux.webhooks.verifySignature(textBody, request.headers, process.env.MUX_WEBHOOK_SECRET)
//    } catch (error) {
//       console.error("MUX webhook verification failed", error)
//       return NextResponse.json({
//          message: "Webhook verification failed"
//       }, {
//          status: 400
//       })
//    }

//    const unwrappedWebhook = mux.webhooks.unwrap(textBody, request.headers)

//    // Start processing the webhook asynchronously
//    processMuxWebhook(unwrappedWebhook)

//    // Return a success response
//    return NextResponse.json({
//       message: "Webhook received"
//    }, {
//       status: 200
//    })
// }
