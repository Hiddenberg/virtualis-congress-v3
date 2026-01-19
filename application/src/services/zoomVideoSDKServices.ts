import "server-only";
import axios from "axios";
import { TEMP_CONSTANTS } from "@/data/tempConstants";
import {
   SessionMetrics,
   SessionMetricsListObject,
} from "@/types/zoomVideoSDKTypes";

const ZOOM_VIDEO_SDK_BASE_URL = "https://api.zoom.us/v2/videosdk";
const ZOOM_VIDEO_SDK_ENDPOINTS = {
   SESSIONS: `${ZOOM_VIDEO_SDK_BASE_URL}/sessions`,
};

const ZOOM_VIDEO_SDK_TOKEN = process.env.ZOOM_VIDEO_SDK_TOKEN;

if (!ZOOM_VIDEO_SDK_TOKEN) {
   throw new Error("ZOOM_VIDEO_SDK_TOKEN is not set");
}

function doubleEncodeZoomSessionId(zoomSessionId: string) {
   return encodeURIComponent(encodeURIComponent(zoomSessionId));
}

export async function getZoomVideoSessions(
   from: string,
   to: string,
   type: "past" | "live" = "past",
) {
   try {
      const { data } = await axios.get<SessionMetricsListObject>(
         ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS,
         {
            params: {
               from,
               to,
               type,
            },
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
         },
      );

      return data;
   } catch (error) {
      console.error(
         "[Zoom Video SDK Service] Error getting zoom video sessions",
         error,
      );
      throw error;
   }
}

export async function getZoomSessionDetails(
   sessionId: string,
   type: "past" | "live" = "past",
) {
   try {
      const response = await axios.get<SessionMetrics>(
         `${ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS}/${doubleEncodeZoomSessionId(sessionId)}`,
         {
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
            params: {
               type,
            },
         },
      );

      if (response.status === 404) {
         console.error(
            "[Zoom Video SDK Service] Session not found",
            response.data,
         );
         return null;
      }

      return response.data;
   } catch (error) {
      console.error(
         "[Zoom Video SDK Service] Error getting zoom session details",
         error,
      );
      throw error;
   }
}

export async function updateZoomSessionLiveStream(
   zoomSessionId: string,
   streamUrl: string,
   streamKey: string,
) {
   try {
      console.log(
         `[Zoom Video SDK Service] Creating live stream for zoom session ${zoomSessionId}`,
      );
      const updateRequest = await axios.patch(
         `${ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS}/${doubleEncodeZoomSessionId(zoomSessionId)}/livestream`,
         {
            stream_url: streamUrl,
            stream_key: streamKey,
            page_url: TEMP_CONSTANTS.ZOOM_BROADCAST_URL,
            resolution: "720p",
         },
         {
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
         },
      );

      if (updateRequest.status === 404) {
         console.error(
            "[Zoom Video SDK Service] Session not found",
            updateRequest.data,
         );
         return {
            success: false,
            message: "Session not found",
         };
      }

      if (updateRequest.status === 204) {
         console.log(
            `[Zoom Video SDK Service] Session live stream updated successfully for zoom session ${zoomSessionId}`,
         );
         return {
            success: true,
            message: "Session live stream updated successfully",
         };
      }

      console.error(
         `[Zoom Video SDK Service] Error updating session live stream for zoom session ${zoomSessionId}`,
         updateRequest.data,
      );
      return {
         success: false,
         message: "Error updating session live stream",
      };
   } catch (error) {
      console.error(
         `[Zoom Video SDK Service] Error updating session live stream for zoom session ${zoomSessionId}`,
         error,
      );
      throw error;
   }
}

export async function getZoomSessionLiveStreamDetails(zoomSessionId: string) {
   try {
      const liveDetailsResponse = await axios.get(
         `${ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS}/${doubleEncodeZoomSessionId(zoomSessionId)}/livestream`,
         {
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
         },
      );

      if (liveDetailsResponse.status !== 200) {
         console.error(
            "[Zoom Video SDK Service] Error getting zoom session live stream details",
            liveDetailsResponse.data,
         );
         return null;
      }

      return liveDetailsResponse.data;
   } catch (error) {
      console.error(
         "[Zoom Video SDK Service] Error getting zoom session live stream details",
         error,
      );
      throw error;
   }
}

export async function startZoomSessionLiveStream(
   zoomSessionId: string,
   sessionDisplayName: string,
) {
   try {
      // Zoom API has a limit of 50 characters for the session display name
      console.log(
         "[Zoom Video SDK Service] Session display name",
         sessionDisplayName,
      );
      if (sessionDisplayName.length >= 49) {
         sessionDisplayName = sessionDisplayName.slice(0, 40);
         console.log(
            "[Zoom Video SDK Service] Session display name truncated",
            sessionDisplayName,
         );
      }

      const startRequest = await axios.patch(
         `${ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS}/${doubleEncodeZoomSessionId(zoomSessionId)}/livestream/status`,
         {
            action: "start",
            settings: {
               active_speaker_name: true,
               display_name: sessionDisplayName,
               layout: "gallery_view",
               close_caption: "off",
            },
         },
         {
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
         },
      );

      if (startRequest.status === 404) {
         console.error(
            "[Zoom Video SDK Service] Session not found",
            startRequest.data,
         );
         return {
            success: false,
            message: "Session not found",
         };
      }

      if (startRequest.status !== 204) {
         console.error(
            "[Zoom Video SDK Service] Error starting stream for zoom session",
            startRequest.data,
         );
         return {
            success: false,
            message: "Error starting stream",
         };
      }

      console.log(
         "[Zoom Video SDK Service] Stream started for zoom session",
         startRequest.data,
      );
      return {
         success: true,
         message: "Stream started successfully",
      };
   } catch (error) {
      console.error(
         "[Zoom Video SDK Service] Error starting stream for zoom session",
         error,
      );
      throw error;
   }
}

export async function stopZoomSessionLiveStream(zoomSessionId: string) {
   try {
      const stopRequest = await axios.patch(
         `${ZOOM_VIDEO_SDK_ENDPOINTS.SESSIONS}/${doubleEncodeZoomSessionId(zoomSessionId)}/livestream/status`,
         {
            action: "stop",
         },
         {
            headers: {
               Authorization: `Bearer ${ZOOM_VIDEO_SDK_TOKEN}`,
            },
         },
      );

      if (stopRequest.status === 404) {
         console.error(
            "[Zoom Video SDK Service] Session not found",
            stopRequest.data,
         );
         return {
            success: false,
            message: "Session not found",
         };
      }

      if (stopRequest.status !== 204) {
         console.error(
            "[Zoom Video SDK Service] Error stopping stream for zoom session",
            stopRequest.data,
         );
         return {
            success: false,
            message: "Error stopping stream",
         };
      }

      console.log(
         "[Zoom Video SDK Service] Stream stopped for zoom session",
         stopRequest.data,
      );
      return {
         success: true,
         message: "Stream stopped successfully",
      };
   } catch (error) {
      console.error(
         "[Zoom Video SDK Service] Error stopping stream for zoom session",
         error,
      );
      throw error;
   }
}
