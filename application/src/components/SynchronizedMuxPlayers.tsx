"use client";

import MuxPlayer from "@mux/mux-player-react";
import { RecordModel } from "pocketbase";
import { useEffect, useRef } from "react";
import { ConferenceVideoAsset } from "@/types/congress";
import { UnifiedControlsBar } from "./UnifiedControlsBar";

type SynchronizedMuxPlayersProps = {
   videoAssets: (ConferenceVideoAsset & RecordModel)[];
   videoTypesText: Record<ConferenceVideoAsset["videoType"], string>;
   title: string;
};

export function SynchronizedMuxPlayers({
   videoAssets,
   videoTypesText,
   title,
}: SynchronizedMuxPlayersProps) {
   const playerRefs = useRef<(HTMLDivElement | null)[]>([]);
   const syncLock = useRef<boolean>(false);
   const syncTimeout = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      // Skip if we don't have at least 2 players
      if (videoAssets.length < 2) return;

      // Get the actual player elements for each Mux Player
      const playerElements = playerRefs.current
         .map((ref) => ref?.querySelector("mux-player"))
         .filter(Boolean) as HTMLMediaElement[];

      // Only proceed if we have valid players
      if (playerElements.length < 2) return;

      // Function to sync all other players with the triggering player
      const syncPlayers = (
         triggeringPlayer: HTMLMediaElement,
         action: "play" | "pause" | "seek",
      ) => {
         // If we're already syncing, don't trigger another sync
         if (syncLock.current) return;

         // Set the lock to prevent recursive syncing
         syncLock.current = true;

         // Clear any existing timeout
         if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
         }

         playerElements.forEach((player) => {
            if (player && player !== triggeringPlayer) {
               if (action === "play") {
                  player
                     .play()
                     .catch((err) => console.error("Error syncing play:", err));
               } else if (action === "pause") {
                  player.pause();
               } else if (action === "seek") {
                  // First pause all videos to prevent playback issues
                  player.pause();
                  // Then set the current time
                  player.currentTime = triggeringPlayer.currentTime;
                  // If the triggering player is playing, resume playback after a short delay
                  if (!triggeringPlayer.paused) {
                     setTimeout(() => {
                        player
                           .play()
                           .catch((err) =>
                              console.error("Error playing after seek:", err),
                           );
                     }, 50);
                  }
               }
            }
         });

         // Release the lock after a short delay
         syncTimeout.current = setTimeout(() => {
            syncLock.current = false;
         }, 100);
      };

      // Add event listeners for each player
      const eventHandlers: { [key: string]: ((e: Event) => void)[] } = {
         play: [],
         pause: [],
         seeked: [],
      };

      playerElements.forEach((player, index) => {
         if (!player) return;

         // Create event handlers for this player
         const playHandler = () => {
            if (!syncLock.current) {
               syncPlayers(player, "play");
            }
         };

         const pauseHandler = () => {
            if (!syncLock.current) {
               syncPlayers(player, "pause");
            }
         };

         const seekedHandler = () => {
            if (!syncLock.current) {
               syncPlayers(player, "seek");
            }
         };

         // Store handlers so we can remove them later
         eventHandlers.play[index] = playHandler;
         eventHandlers.pause[index] = pauseHandler;
         eventHandlers.seeked[index] = seekedHandler;

         // Add event listeners
         player.addEventListener("play", playHandler);
         player.addEventListener("pause", pauseHandler);
         player.addEventListener("seeked", seekedHandler);
      });

      // Cleanup function to remove event listeners
      return () => {
         // Clear any pending timeout
         if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
         }

         playerElements.forEach((player, index) => {
            if (!player) return;
            player.removeEventListener("play", eventHandlers.play[index]);
            player.removeEventListener("pause", eventHandlers.pause[index]);
            player.removeEventListener("seeked", eventHandlers.seeked[index]);
         });
      };
   }, [videoAssets]);

   // Initialize refs array with proper length
   if (playerRefs.current.length !== videoAssets.length) {
      playerRefs.current = Array(videoAssets.length).fill(null);
   }

   // Determine if we should mute screen video (when there are multiple videos)
   const shouldMuteScreenVideo = videoAssets.length >= 2;

   return (
      <div>
         <div className="gap-6 grid lg:grid-cols-2">
            {videoAssets.map((videoAsset, index) => {
               // Check if this is a screen video that should be muted
               const isScreenVideo = videoAsset.videoType === "screen";
               const shouldMute = shouldMuteScreenVideo && isScreenVideo;

               return (
                  <div key={videoAsset.id} className="flex flex-col">
                     <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700 text-sm">
                           {videoTypesText[videoAsset.videoType]}
                        </span>
                     </div>
                     <div
                        className="relative bg-black rounded-lg aspect-video overflow-hidden"
                        ref={(el) => {
                           playerRefs.current[index] = el;
                        }}
                     >
                        <MuxPlayer
                           playbackId={videoAsset.muxPlaybackId}
                           metadataVideoTitle={title}
                           metadata-viewer-user-id="user-id"
                           primary-color="#ffffff"
                           secondary-color="#000000"
                           accent-color="#fa50b5"
                           className="w-full h-full"
                           stream-type="on-demand"
                           style={
                              {
                                 "--controls": "none",
                              } as React.CSSProperties
                           }
                           muted={shouldMute}
                        />
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Add the unified controls bar */}
         <UnifiedControlsBar playerRefs={playerRefs} />
      </div>
   );
}
