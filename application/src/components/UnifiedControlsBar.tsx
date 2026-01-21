"use client";

import { Maximize2, Minimize2, Pause, Play } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatVideoTime } from "@/utils/recorderUtils";

type UnifiedControlsBarProps = {
   playerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
   title?: string;
   containerRef?: React.RefObject<HTMLElement | null>;
   isSmall?: boolean;
};

export function UnifiedControlsBar({ playerRefs, title, containerRef, isSmall = false }: UnifiedControlsBarProps) {
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [isFullscreen, setIsFullscreen] = useState(false);
   const syncLock = useRef<boolean>(false);
   const syncTimeout = useRef<NodeJS.Timeout | null>(null);

   // Get the Mux player elements from refs
   const getPlayerElements = useCallback(() => {
      return playerRefs.current.map((ref) => ref?.querySelector("mux-player")).filter(Boolean) as HTMLMediaElement[];
   }, [playerRefs]);

   const getPrimaryContainer = useCallback(() => {
      return playerRefs.current[0] || null;
   }, [playerRefs]);

   const getFullscreenContainer = useCallback(() => {
      return (containerRef?.current as HTMLElement | null) ?? getPrimaryContainer();
   }, [containerRef, getPrimaryContainer]);

   useEffect(() => {
      const playerElements = getPlayerElements();
      if (playerElements.length === 0) return;

      // Use the first player as the "master" for time tracking
      const masterPlayer = playerElements[0];

      const handleTimeUpdate = () => {
         setCurrentTime(masterPlayer.currentTime);
      };

      const handleLoadedMetadata = () => {
         setDuration(masterPlayer.duration);
      };

      const handlePlay = () => {
         setIsPlaying(true);
      };

      const handlePause = () => {
         setIsPlaying(false);
      };

      // Add event listeners
      masterPlayer.addEventListener("timeupdate", handleTimeUpdate);
      masterPlayer.addEventListener("loadedmetadata", handleLoadedMetadata);
      masterPlayer.addEventListener("play", handlePlay);
      masterPlayer.addEventListener("pause", handlePause);

      // Set initial duration if already loaded
      if (masterPlayer.duration) {
         setDuration(masterPlayer.duration);
      }

      return () => {
         // Clean up event listeners
         masterPlayer.removeEventListener("timeupdate", handleTimeUpdate);
         masterPlayer.removeEventListener("loadedmetadata", handleLoadedMetadata);
         masterPlayer.removeEventListener("play", handlePlay);
         masterPlayer.removeEventListener("pause", handlePause);
      };
   }, [getPlayerElements]);

   // Track fullscreen changes
   useEffect(() => {
      const onFsChange = () => {
         const container = getFullscreenContainer();
         setIsFullscreen(Boolean(document.fullscreenElement && container && document.fullscreenElement === container));
      };
      document.addEventListener("fullscreenchange", onFsChange);
      return () => document.removeEventListener("fullscreenchange", onFsChange);
   }, [getFullscreenContainer]);

   // Syncs all players with the given action
   const syncPlayers = (action: "play" | "pause" | "seek", seekTime?: number) => {
      // If we're already syncing, don't trigger another sync
      if (syncLock.current) return;

      // Set the lock to prevent recursive syncing
      syncLock.current = true;

      // Clear any existing timeout
      if (syncTimeout.current) {
         clearTimeout(syncTimeout.current);
      }

      const playerElements = getPlayerElements();

      playerElements.forEach((player) => {
         if (action === "play") {
            player.play().catch((err) => console.error("Error syncing play:", err));
         } else if (action === "pause") {
            player.pause();
         } else if (action === "seek" && seekTime !== undefined) {
            // First pause all videos to prevent playback issues
            player.pause();
            // Then set the current time
            player.currentTime = seekTime;
            // If we were playing before seeking, resume playback
            if (isPlaying) {
               setTimeout(() => {
                  player.play().catch((err) => console.error("Error playing after seek:", err));
               }, 50);
            }
         }
      });

      // Update state based on the action
      if (action === "play") setIsPlaying(true);
      if (action === "pause") setIsPlaying(false);
      if (action === "seek" && seekTime !== undefined) setCurrentTime(seekTime);

      // Release the lock after a short delay
      syncTimeout.current = setTimeout(() => {
         syncLock.current = false;
      }, 100);
   };

   const handlePlay = () => {
      syncPlayers("play");
   };

   const handlePause = () => {
      syncPlayers("pause");
   };

   const handleSeek = (value: number) => {
      syncPlayers("seek", value);
   };

   const toggleFullscreen = async () => {
      try {
         const container = getFullscreenContainer();
         if (!container) return;
         if (document.fullscreenElement) {
            await document.exitFullscreen();
         } else {
            await container.requestFullscreen();
         }
      } catch (err) {
         console.error("Fullscreen toggle error", err);
      }
   };

   const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

   return (
      <div className={isSmall ? "space-y-2" : "space-y-4"}>
         {title && (
            <div className="text-center">
               <h3 className={`font-medium text-gray-800 ${isSmall ? "text-xs" : "text-sm"}`}>{title}</h3>
            </div>
         )}

         {/* Modern seek bar with progress indication */}
         <div className="group relative">
            {/* Progress track */}
            <div className={`bg-gray-300 rounded-full w-full overflow-hidden ${isSmall ? "h-1" : "h-2"}`}>
               <div
                  className="bg-black rounded-full h-full transition-all duration-100 ease-out"
                  style={{
                     width: `${progress}%`,
                  }}
               />
            </div>

            {/* Invisible input for seeking */}
            <input
               type="range"
               min={0}
               max={duration || 100}
               step="0.01"
               value={currentTime}
               onChange={(e) => handleSeek(Number(e.target.value))}
               className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
               aria-label="Seek video"
            />

            {/* Hover indicator */}
            <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               <div className="bg-black/80 px-2 py-1 rounded font-medium text-white text-xs">{formatVideoTime(currentTime)}</div>
            </div>
         </div>

         {/* Controls layout */}
         <div className="flex justify-between items-center">
            {/* Time display */}
            <div className="flex items-center space-x-1">
               <span className={`font-mono text-gray-700 ${isSmall ? "text-xs" : "text-sm"}`}>
                  {formatVideoTime(currentTime)}
               </span>
               <span className={`text-gray-400 ${isSmall ? "text-xs" : "text-sm"}`}>/</span>
               <span className={`font-mono text-gray-500 ${isSmall ? "text-xs" : "text-sm"}`}>{formatVideoTime(duration)}</span>
            </div>

            {/* Central play/pause button */}
            <div className="flex flex-1 justify-center">
               {isPlaying ? (
                  <button
                     className={`bg-black hover:bg-gray-800 shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 text-white hover:scale-105 transition-all duration-200 ${isSmall ? "p-2" : "p-3"}`}
                     onClick={handlePause}
                     aria-label="Pause"
                     title="Pause"
                  >
                     <Pause className={`fill-current ${isSmall ? "w-4 h-4" : "w-6 h-6"}`} />
                  </button>
               ) : (
                  <button
                     className={`bg-black hover:bg-gray-800 shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 text-white hover:scale-105 transition-all duration-200 ${isSmall ? "p-2" : "p-3"}`}
                     onClick={handlePlay}
                     aria-label="Play"
                     title="Play"
                  >
                     <Play className={`fill-current ml-0.5 ${isSmall ? "w-4 h-4" : "w-6 h-6"}`} />
                  </button>
               )}
            </div>

            {/* Fullscreen button */}
            <div className="flex justify-end">
               <button
                  className={`hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 ${isSmall ? "p-1.5" : "p-2.5"}`}
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
               >
                  {isFullscreen ? (
                     <Minimize2 className={isSmall ? "w-4 h-4" : "w-5 h-5"} />
                  ) : (
                     <Maximize2 className={isSmall ? "w-4 h-4" : "w-5 h-5"} />
                  )}
               </button>
            </div>
         </div>
      </div>
   );
}
