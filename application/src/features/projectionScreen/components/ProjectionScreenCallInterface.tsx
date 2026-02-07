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
   const [isConnecting, setIsConnecting] = useState(true);
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
         console.log("[ensureUserVideoAttached] ensuring user video attached for user id", userId);
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
         console.log("[detachUserVideo] detaching user video for user id", userId);
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
      console.log("[startShareViewForUserId] starting share view for user id", userId);
      const mediaStream = mediaStreamRef.current;
      if (!mediaStream) {
         console.error("[startShareViewForUserId] media stream is null");
         const newMediaStream = await zoomClientRef.current?.getMediaStream();
         if (!newMediaStream) {
            console.error("[startShareViewForUserId] new media couldn't be created");
            return;
         }
         mediaStreamRef.current = newMediaStream;

         if (!shareViewRef.current) {
            console.error("[startShareViewForUserId] share view ref is null");
            return;
         }

         console.log("[startShareViewForUserId] starting share view for user id on second attempt", userId);
         await newMediaStream.startShareView(shareViewRef.current, userId);
         console.log("[startShareViewForUserId] share view for user id on second attempt", userId, "started");
         return;
      }
      if (!shareViewRef.current) {
         console.error("[startShareViewForUserId] share view ref is null");
         return;
      }
      setIsSharing(true);
      setSpotlightUserId(null);
      console.log("[startShareViewForUserId] starting share view for user id", userId);
      await mediaStream.startShareView(shareViewRef.current, userId);
      console.log("[startShareViewForUserId] share view for user id", userId, "started");
   }, []);

   const stopShareView = useCallback(() => {
      console.log("[stopShareView] stopping share view");
      const mediaStream = mediaStreamRef.current;
      if (!mediaStream) return;
      setIsSharing(false);
      mediaStream.stopShareView();
      syncLayout();
   }, [syncLayout]);

   const handlePeerVideoStateChange = useCallback(
      ({ action, userId }: { action: "Start" | "Stop"; userId: number }) => {
         console.log("[handlePeerVideoStateChange] peer video state change", action, userId);
         if (action === "Start") {
            attachUserVideo(userId);
            return;
         }
         detachUserVideo(userId);
      },
      [attachUserVideo, detachUserVideo],
   );

   const handleActiveShareChange = useCallback(
      ({ state, userId }: ActiveShareChangePayload) => {
         console.log("[handleActiveShareChange] active share change", state, userId);
         if (state === "Active") {
            startShareViewForUserId(userId);
            return;
         }
         stopShareView();
      },
      [startShareViewForUserId, stopShareView],
   );

   const handleVideoActiveChange = useCallback((payload: VideoActiveChangePayload) => {
      console.log("[handleVideoActiveChange] video active change", payload);
      if (hasSpotlightRef.current) return;
      const activeId = payload.activeUsers?.[0] ?? payload.userId ?? null;
      setSpotlightUserId(activeId);
   }, []);

   const handleVideoSpotlightChange = useCallback(
      (payload: VideoSpotlightChangePayload) => {
         console.log("[handleVideoSpotlightChange] video spotlight change", payload);
         const spotlightId = payload.spotlightList[0]?.userId ?? null;
         hasSpotlightRef.current = payload.spotlightList.length > 0;
         setSpotlightUserId(spotlightId);
         ensureUserVideoAttached(spotlightId);
      },
      [ensureUserVideoAttached],
   );

   const handleUserRemoved = useCallback(
      ({ userId }: { userId: number }) => {
         console.log("[handleUserRemoved] user removed", userId);
         detachUserVideo(userId);
      },
      [detachUserVideo],
   );

   const handleUserUpdated = useCallback(
      (payload: Array<{ userId: number; bVideoOn?: boolean }>) => {
         console.log("[handleUserUpdated] user updated", payload);
         if (!spotlightUserId) return;
         const spotlightUser = payload.find((user) => user.userId === spotlightUserId);
         if (!spotlightUser?.bVideoOn) return;
         ensureUserVideoAttached(spotlightUserId);
      },
      [ensureUserVideoAttached, spotlightUserId],
   );

   useEffect(() => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      const joinSession = async () => {
         try {
            setIsConnecting(true);
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
            zoomClient.on("connection-change", async (payload) => {
               const connectionState = payload.state;

               console.log("[ProjectionScreen] CONNECTION STATE CHANGE", payload);

               switch (connectionState) {
                  case "Closed":
                     console.log("[ProjectionScreen] connection changed to closed");
                     break;
                  case "Connected": {
                     console.log("[ProjectionScreen] connection changed to connected");
                     break;
                  }
                  case "Fail":
                     console.log("[ProjectionScreen] connection changed to fail");
                     break;
                  case "Reconnecting":
                     console.log("[ProjectionScreen] connection changed to reconnecting");
                     break;

                  default:
                     console.log("[ProjectionScreen] connection changed to unknown state", connectionState);
                     break;
               }
            });

            console.log("[ProjectionScreen] joining session");
            await zoomClient.join(sessionName, token, userName);
            console.log("[ProjectionScreen] session joined");

            isInMeetingRef.current = true;
            mediaStreamRef.current = zoomClient.getMediaStream();
            const activeShareUserId = mediaStreamRef.current.getActiveShareUserId();
            const someoneIsSharing = mediaStreamRef.current.getShareUserList().length > 0 || activeShareUserId !== 0;
            const spotlightedUsersList = mediaStreamRef.current.getSpotlightedUserList();
            const someoneHasSpotlight = spotlightedUsersList.length > 0;
            console.log("[ProjectionScreen] ------------------------------ zoom details START ------------------------------");
            console.log("[ProjectionScreen] sessionName", sessionName);
            console.log("[ProjectionScreen] userName", userName);
            console.log("[ProjectionScreen] sessionKey", sessionKey);
            console.log("[ProjectionScreen] someoneIsSharing", someoneIsSharing);
            console.log("[ProjectionScreen] someoneHasSpotlight", someoneHasSpotlight);
            console.log("[ProjectionScreen] activeShareUserId", activeShareUserId);
            console.log("[ProjectionScreen] shareUserList", mediaStreamRef.current.getShareUserList());
            console.log("[ProjectionScreen] spotlightedUsersList", spotlightedUsersList);
            console.log("[ProjectionScreen] ------------------------------ zoom details END ------------------------------");
            if (someoneIsSharing) {
               const activeShareUserId = mediaStreamRef.current.getActiveShareUserId();
               const fallbackShareUserId = mediaStreamRef.current.getShareUserList()[0]?.userId;
               const shareUserId = activeShareUserId || fallbackShareUserId;
               console.log("[ProjectionScreen] shareUserId found", shareUserId);
               if (shareUserId) {
                  console.log("[ProjectionScreen] starting share view for user id", shareUserId);
                  await startShareViewForUserId(shareUserId);
                  console.log("[ProjectionScreen] share view for user id", shareUserId, "started");
               } else {
                  console.warn("[ProjectionScreen] no share user id found, someoneIsSharing is true but no share user id");
               }
            } else if (someoneHasSpotlight) {
               console.log("[ProjectionScreen] someoneHasSpotlight is true, starting spotlight");
               hasSpotlightRef.current = true;
               const spotlightId = spotlightedUsersList[0]?.userId ?? null;
               console.log("[ProjectionScreen] spotlightId found after getSpotlightedUserList", spotlightId);
               setSpotlightUserId(spotlightId);
               console.log("[ProjectionScreen] starting spotlight for user id", spotlightId);
               await ensureUserVideoAttached(spotlightId);
               console.log("[ProjectionScreen] spotlight for user id", spotlightId, "attached");
            } else {
               console.warn("[ProjectionScreen] No one is sharing or spotlighting");
            }

            console.log("[ProjectionScreen] attaching all users videos");
            zoomClient.getAllUser().forEach((user) => {
               if (user.bVideoOn) {
                  attachUserVideo(user.userId);
                  console.log("[ProjectionScreen] attached video for user id", user.userId);
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
               console.error("[ProjectionScreen] Error joining session", error);
               return;
            }
            console.error("[ProjectionScreen] Error joining session", error);
            setErrorMessage("No se pudo conectar a la sesión de Zoom.");
         } finally {
            setIsConnecting(false);
         }
      };

      console.log("[ProjectionScreen] running joining session");
      joinSession();
      console.log("[ProjectionScreen] joining session done");

      return () => {
         if (isInMeetingRef.current) {
            zoomClientRef.current?.leave();
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
      ensureUserVideoAttached(spotlightUserId);
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
         {isConnecting && !errorMessage && (
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-black/70 text-white">
               <div className="border-4 border-white/40 border-t-white rounded-full w-10 h-10 animate-spin" />
               <p className="font-semibold text-lg">Conectando a la sesión...</p>
            </div>
         )}
         {errorMessage && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/70 font-semibold text-white text-lg">
               {errorMessage}
            </div>
         )}
      </div>
   );
}
