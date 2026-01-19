"use client";

import MuxPlayer from "@mux/mux-player-react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { RecordModel } from "pocketbase";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ConferenceVideoAsset } from "@/types/congress";
import { formatVideoTime } from "@/utils/recorderUtils";

interface SynchVideoPlayerProps {
   conferenceMuxAssets: (ConferenceVideoAsset & RecordModel)[];
   title?: string;
}

export default function SynchVideoPlayer({
   conferenceMuxAssets,
   title,
}: SynchVideoPlayerProps) {
   const playerRefs = useRef<(HTMLDivElement | null)[]>([]);

   // Initialize refs array with proper length
   if (playerRefs.current.length !== conferenceMuxAssets.length) {
      playerRefs.current = Array(conferenceMuxAssets.length).fill(null);
   }

   if (conferenceMuxAssets.length === 1) {
      return (
         <div>
            <MuxPlayer
               className="rounded-xl w-full overflow-hidden"
               playbackId={conferenceMuxAssets[0].muxPlaybackId}
            />
         </div>
      );
   }

   const playerStyles: Record<ConferenceVideoAsset["videoType"], string> = {
      camera: "w-1/5",
      screen: "w-4/5",
      combined: "w-1/2",
      other: "w-1/2",
   };

   return (
      <div>
         <div className="flex items-center gap-1 bg-black px-2 rounded-xl rounded-b-none w-full aspect-video overflow-hidden">
            {conferenceMuxAssets.map((asset, index) => (
               <div
                  key={asset.id}
                  ref={(el) => {
                     playerRefs.current[index] = el;
                  }}
                  className={`${playerStyles[asset.videoType]}`}
               >
                  <MuxPlayer
                     key={asset.id}
                     muted={asset.videoType !== "camera"}
                     className="w-full h-full"
                     playbackId={asset.muxPlaybackId}
                     style={{
                        "--controls": "none",
                     }}
                  />
               </div>
            ))}
         </div>

         <UnifiedControlsBar playerRefs={playerRefs} title={title} />
      </div>
   );
}

function UnifiedControlsBar({
   playerRefs,
   title,
}: {
   playerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
   title?: string;
}) {
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const syncLock = useRef<boolean>(false);
   const syncTimeout = useRef<NodeJS.Timeout | null>(null);

   // Get the Mux player elements from refs
   const getPlayerElements = useCallback(() => {
      return playerRefs.current
         .map((ref) => ref?.querySelector("mux-player"))
         .filter(Boolean) as HTMLMediaElement[];
   }, [playerRefs]);

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
         masterPlayer.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata,
         );
         masterPlayer.removeEventListener("play", handlePlay);
         masterPlayer.removeEventListener("pause", handlePause);
      };
   }, [getPlayerElements]);

   // Syncs all players with the given action
   const syncPlayers = (
      action: "play" | "pause" | "seek",
      seekTime?: number,
   ) => {
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
            player
               .play()
               .catch((err) => console.error("Error syncing play:", err));
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
                  player
                     .play()
                     .catch((err) =>
                        console.error("Error playing after seek:", err),
                     );
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

   const handleSkipBackward = () => {
      const newTime = Math.max(0, currentTime - 10);
      syncPlayers("seek", newTime);
   };

   const handleSkipForward = () => {
      const newTime = Math.min(duration, currentTime + 10);
      syncPlayers("seek", newTime);
   };

   return (
      <div className="bg-gray-100 shadow-md p-4 border border-gray-200 rounded-lg rounded-t-none">
         {title && (
            <h3 className="mb-4 font-medium text-gray-700 text-center">
               {title}
            </h3>
         )}

         <div className="flex flex-col space-y-3">
            {/* Seek slider */}
            <div className="relative w-full">
               <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step="0.01"
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="bg-gray-200 rounded-lg w-full h-2 accent-black appearance-none cursor-pointer"
               />
            </div>

            {/* Controls and time display */}
            <div className="flex justify-between items-center">
               {/* Time display */}
               <span className="font-medium text-gray-700 text-sm">
                  {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
               </span>

               {/* Playback controls */}
               <div className="flex items-center space-x-4">
                  <button
                     className="hover:bg-gray-200 p-2 border rounded-full transition-colors"
                     onClick={handleSkipBackward}
                     aria-label="Skip backward 10 seconds"
                  >
                     <SkipBack className="w-5 h-5" />
                  </button>

                  {isPlaying ? (
                     <button
                        className="bg-white hover:bg-gray-100 p-3 border rounded-full transition-colors"
                        onClick={handlePause}
                        aria-label="Pause"
                     >
                        <Pause className="w-6 h-6" />
                     </button>
                  ) : (
                     <button
                        className="bg-white hover:bg-gray-100 p-3 border rounded-full transition-colors"
                        onClick={handlePlay}
                        aria-label="Play"
                     >
                        <Play className="w-6 h-6" />
                     </button>
                  )}

                  <button
                     className="hover:bg-gray-200 p-2 border rounded-full transition-colors"
                     onClick={handleSkipForward}
                     aria-label="Skip forward 10 seconds"
                  >
                     <SkipForward className="w-5 h-5" />
                  </button>
               </div>

               <div className="w-20">
                  {/* Empty div to balance the layout */}
               </div>
            </div>
         </div>
      </div>
   );
}
