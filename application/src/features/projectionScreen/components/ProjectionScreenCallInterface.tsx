"use client";

import ZoomVideo, { VideoQuality } from "@zoom/videosdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useZoomSession } from "@/features/livestreams/contexts/ZoomSessionContext";
import { getZoomTokenAction } from "@/features/livestreams/serverActions/ZoomSessionActions";

interface ActiveShareChangePayload {
   state: "Active" | "Inactive";
   userId: number;
}

interface VideoActiveChangePayload {
   activeUsers?: number[];
   userId?: number;
}

interface VideoSpotlightChangePayload {
   spotlightList: Array<{ userId: number }>;
}

export default function ProjectionScreenCallInterface({
   initialUsername,
   className,
}: {
   initialUsername: string;
   className: string;
}) {
   const [isSharing, setIsSharing] = useState(false);
   const [spotlightUserId, setSpotlightUserId] = useState<number | null>(null);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const { sessionName, sessionKey } = useZoomSession();
   const hasJoinedRef = useRef(false);
   const hasSpotlightRef = useRef(false);
   const isInMeetingRef = useRef(false);
   type ZoomClient = ReturnType<typeof ZoomVideo.createClient>;
   type ZoomMediaStream = ReturnType<ZoomClient["getMediaStream"]>;
   const zoomClientRef = useRef<ZoomClient | null>(null);
   const mediaStreamRef = useRef<ZoomMediaStream | null>(null);
   const gridContainerRef = useRef<HTMLDivElement>(null);
   const spotlightContainerRef = useRef<HTMLDivElement>(null);
   const shareViewRef = useRef<HTMLCanvasElement>(null);
   const videoElementsRef = useRef<Map<number, HTMLElement>>(new Map());

   const userName = useMemo(() => {
      return initialUsername?.trim() ? initialUsername : "Pantalla Proyección";
   }, [initialUsername]);

   const moveVideoElement = useCallback((userId: number, target: HTMLDivElement | null) => {
      const element = videoElementsRef.current.get(userId);
      if (!element || !target) return;
      if (element.parentElement !== target) {
         target.appendChild(element);
      }
   }, []);

   const syncLayout = useCallback(() => {
      const gridContainer = gridContainerRef.current;
      const spotlightContainer = spotlightContainerRef.current;
      if (!gridContainer || !spotlightContainer) return;
      if (isSharing) return;

      if (spotlightUserId) {
         videoElementsRef.current.forEach((_element, userId) => {
            if (userId === spotlightUserId) {
               moveVideoElement(userId, spotlightContainer);
            } else {
               moveVideoElement(userId, gridContainer);
            }
         });
         return;
      }

      videoElementsRef.current.forEach((_element, userId) => {
         moveVideoElement(userId, gridContainer);
      });
   }, [isSharing, moveVideoElement, spotlightUserId]);

   const attachUserVideo = useCallback(
      async (userId: number) => {
         if (!mediaStreamRef.current) return;
         if (videoElementsRef.current.has(userId)) return;
         const videoElement = (await mediaStreamRef.current.attachVideo(userId, VideoQuality.Video_720P)) as HTMLElement;
         videoElement.className = "w-full h-full object-cover rounded-2xl";
         videoElementsRef.current.set(userId, videoElement);
         syncLayout();
      },
      [syncLayout],
   );

   const ensureUserVideoAttached = useCallback(
      async (userId: number | null) => {
         if (!userId) return;
         try {
            await attachUserVideo(userId);
         } catch (error) {
            console.warn("[ProjectionScreen] Unable to attach user video", error);
         }
      },
      [attachUserVideo],
   );

   const detachUserVideo = useCallback(
      async (userId: number) => {
         if (!mediaStreamRef.current) return;
         const element = videoElementsRef.current.get(userId);
         if (!element) return;
         await mediaStreamRef.current.detachVideo(userId);
         element.remove();
         videoElementsRef.current.delete(userId);
         if (spotlightUserId === userId) {
            setSpotlightUserId(null);
         }
      },
      [spotlightUserId],
   );

   const startShareViewForUserId = useCallback(async (userId: number) => {
      const mediaStream = mediaStreamRef.current;
      if (!mediaStream || !shareViewRef.current) return;
      setIsSharing(true);
      setSpotlightUserId(null);
      await mediaStream.startShareView(shareViewRef.current, userId);
   }, []);

   const stopShareView = useCallback(() => {
      const mediaStream = mediaStreamRef.current;
      if (!mediaStream) return;
      setIsSharing(false);
      void mediaStream.stopShareView();
      syncLayout();
   }, [syncLayout]);

   const handlePeerVideoStateChange = useCallback(
      ({ action, userId }: { action: "Start" | "Stop"; userId: number }) => {
         if (action === "Start") {
            void attachUserVideo(userId);
            return;
         }
         void detachUserVideo(userId);
      },
      [attachUserVideo, detachUserVideo],
   );

   const handleActiveShareChange = useCallback(
      ({ state, userId }: ActiveShareChangePayload) => {
         if (state === "Active") {
            void startShareViewForUserId(userId);
            return;
         }
         stopShareView();
      },
      [startShareViewForUserId, stopShareView],
   );

   const handleVideoActiveChange = useCallback((payload: VideoActiveChangePayload) => {
      if (hasSpotlightRef.current) return;
      const activeId = payload.activeUsers?.[0] ?? payload.userId ?? null;
      setSpotlightUserId(activeId);
   }, []);

   const handleVideoSpotlightChange = useCallback(
      (payload: VideoSpotlightChangePayload) => {
         const spotlightId = payload.spotlightList[0]?.userId ?? null;
         hasSpotlightRef.current = payload.spotlightList.length > 0;
         setSpotlightUserId(spotlightId);
         void ensureUserVideoAttached(spotlightId);
      },
      [ensureUserVideoAttached],
   );

   const handleUserRemoved = useCallback(
      ({ userId }: { userId: number }) => {
         void detachUserVideo(userId);
      },
      [detachUserVideo],
   );

   const handleUserUpdated = useCallback(
      (payload: Array<{ userId: number; bVideoOn?: boolean }>) => {
         if (!spotlightUserId) return;
         const spotlightUser = payload.find((user) => user.userId === spotlightUserId);
         if (!spotlightUser?.bVideoOn) return;
         void ensureUserVideoAttached(spotlightUserId);
      },
      [ensureUserVideoAttached, spotlightUserId],
   );

   useEffect(() => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      const joinSession = async () => {
         try {
            setErrorMessage(null);
            const isCompatible = ZoomVideo.checkSystemRequirements();
            if (!isCompatible) {
               setErrorMessage("El navegador no es compatible con Zoom Video SDK.");
               return;
            }

            ZoomVideo.preloadDependentAssets();
            const zoomClient = ZoomVideo.createClient();
            zoomClientRef.current = zoomClient;

            await zoomClient.init("es-ES", "Global", {
               patchJsMedia: true,
               leaveOnPageUnload: true,
               stayAwake: true,
            });

            const { errorMessage: tokenError, token } = await getZoomTokenAction(
               sessionName,
               userName,
               sessionKey,
               "participant",
            );

            if (tokenError || !token) {
               setErrorMessage(tokenError ?? "No se pudo obtener el token de Zoom.");
               return;
            }

            zoomClient.on("peer-video-state-change", handlePeerVideoStateChange);
            zoomClient.on("active-share-change", handleActiveShareChange);
            zoomClient.on("video-active-change", handleVideoActiveChange);
            zoomClient.on("video-spotlight-change", handleVideoSpotlightChange);
            zoomClient.on("user-updated", handleUserUpdated);
            zoomClient.on("user-removed", handleUserRemoved);

            await zoomClient.join(sessionName, token, userName);
            isInMeetingRef.current = true;
            mediaStreamRef.current = zoomClient.getMediaStream();
            const someoneIsSharing = mediaStreamRef.current.getShareUserList().length > 0;
            const spotlightedUsersList = mediaStreamRef.current.getSpotlightedUserList();
            const someoneHasSpotlight = spotlightedUsersList.length > 0;
            if (someoneIsSharing) {
               const activeShareUserId = mediaStreamRef.current.getActiveShareUserId();
               const fallbackShareUserId = mediaStreamRef.current.getShareUserList()[0]?.userId;
               const shareUserId = activeShareUserId || fallbackShareUserId;
               if (shareUserId) {
                  await startShareViewForUserId(shareUserId);
               }
            } else if (someoneHasSpotlight) {
               hasSpotlightRef.current = true;
               const spotlightId = spotlightedUsersList[0]?.userId ?? null;
               setSpotlightUserId(spotlightId);
               await ensureUserVideoAttached(spotlightId);
            }

            zoomClient.getAllUser().forEach((user) => {
               if (user.bVideoOn) {
                  void attachUserVideo(user.userId);
               }
            });
         } catch (error) {
            if (
               typeof error === "object" &&
               error !== null &&
               "type" in error &&
               "reason" in error &&
               error.type === "OPERATION_CANCELLED" &&
               error.reason === "LEAVING_MEETING"
            ) {
               return;
            }
            console.error("[ProjectionScreen] Error joining session", error);
            setErrorMessage("No se pudo conectar a la sesión de Zoom.");
         }
      };

      void joinSession();

      return () => {
         if (isInMeetingRef.current) {
            void zoomClientRef.current?.leave();
         }
         isInMeetingRef.current = false;
         zoomClientRef.current?.off("peer-video-state-change", handlePeerVideoStateChange);
         zoomClientRef.current?.off("active-share-change", handleActiveShareChange);
         zoomClientRef.current?.off("video-active-change", handleVideoActiveChange);
         zoomClientRef.current?.off("video-spotlight-change", handleVideoSpotlightChange);
         zoomClientRef.current?.off("user-updated", handleUserUpdated);
         zoomClientRef.current?.off("user-removed", handleUserRemoved);
         videoElementsRef.current.forEach((element) => {
            element.remove();
         });
         videoElementsRef.current.clear();
         mediaStreamRef.current = null;
         zoomClientRef.current = null;
      };
   }, [
      attachUserVideo,
      handleActiveShareChange,
      handlePeerVideoStateChange,
      handleUserRemoved,
      handleUserUpdated,
      handleVideoActiveChange,
      handleVideoSpotlightChange,
      ensureUserVideoAttached,
      sessionKey,
      sessionName,
      startShareViewForUserId,
      userName,
   ]);

   useEffect(() => {
      void ensureUserVideoAttached(spotlightUserId);
   }, [ensureUserVideoAttached, spotlightUserId]);

   useEffect(() => {
      syncLayout();
   }, [syncLayout]);

   const showGrid = !isSharing && !spotlightUserId;
   const showSpotlight = !isSharing && !!spotlightUserId;

   console.log("[ProjectionScreen] show grid", showGrid);
   console.log("[ProjectionScreen] show spotlight", showSpotlight);

   return (
      <div className={`relative w-full h-full ${className}`}>
         <canvas ref={shareViewRef} className={`w-full h-full ${isSharing ? "block" : "hidden"}`} />
         {/* @ts-expect-error custom element from Zoom SDK */}
         <video-player-container className={`w-full h-full ${isSharing ? "hidden" : "block"}`}>
            <div
               ref={spotlightContainerRef}
               className={`w-full h-full ${showSpotlight ? "flex" : "hidden"} items-center justify-center`}
            />
            <div
               ref={gridContainerRef}
               className={`w-full h-full ${showGrid ? "grid" : "hidden"} gap-3`}
               style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
               }}
            />
            {/* @ts-expect-error custom element from Zoom SDK */}
         </video-player-container>
         {errorMessage && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/70 font-semibold text-white text-lg">
               {errorMessage}
            </div>
         )}
      </div>
   );
}
