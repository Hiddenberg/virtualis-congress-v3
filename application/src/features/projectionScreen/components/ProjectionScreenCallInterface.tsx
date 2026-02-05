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
         const mediaStream = mediaStreamRef.current;
         if (!mediaStream || !shareViewRef.current) return;
         if (state === "Active") {
            setIsSharing(true);
            setSpotlightUserId(null);
            void mediaStream.startShareView(shareViewRef.current, userId);
            return;
         }
         setIsSharing(false);
         void mediaStream.stopShareView();
         syncLayout();
      },
      [syncLayout],
   );

   const handleVideoActiveChange = useCallback((payload: VideoActiveChangePayload) => {
      const activeId = payload.activeUsers?.[0] ?? payload.userId ?? null;
      setSpotlightUserId(activeId);
   }, []);

   const handleUserRemoved = useCallback(
      ({ userId }: { userId: number }) => {
         void detachUserVideo(userId);
      },
      [detachUserVideo],
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
            zoomClient.on("user-removed", handleUserRemoved);

            await zoomClient.join(sessionName, token, userName);
            mediaStreamRef.current = zoomClient.getMediaStream();

            zoomClient.getAllUser().forEach((user) => {
               if (user.bVideoOn) {
                  void attachUserVideo(user.userId);
               }
            });
         } catch (error) {
            console.error("[ProjectionScreen] Error joining session", error);
            setErrorMessage("No se pudo conectar a la sesión de Zoom.");
         }
      };

      void joinSession();

      const handlePageHide = () => {
         void zoomClientRef.current?.leave();
      };

      window.addEventListener("pagehide", handlePageHide);

      return () => {
         window.removeEventListener("pagehide", handlePageHide);
         zoomClientRef.current?.leave();
         zoomClientRef.current?.off("peer-video-state-change", handlePeerVideoStateChange);
         zoomClientRef.current?.off("active-share-change", handleActiveShareChange);
         zoomClientRef.current?.off("video-active-change", handleVideoActiveChange);
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
      handleVideoActiveChange,
      sessionKey,
      sessionName,
      userName,
   ]);

   useEffect(() => {
      syncLayout();
   }, [syncLayout]);

   const showGrid = !isSharing && !spotlightUserId;
   const showSpotlight = !isSharing && !!spotlightUserId;

   return (
      <div className={`relative w-full h-full ${className}`}>
         <canvas ref={shareViewRef} className={`w-full h-full ${isSharing ? "block" : "hidden"}`} />
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
         {errorMessage && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/70 font-semibold text-white text-lg">
               {errorMessage}
            </div>
         )}
      </div>
   );
}
