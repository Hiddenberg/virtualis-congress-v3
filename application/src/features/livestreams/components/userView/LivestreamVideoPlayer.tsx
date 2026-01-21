"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import UnmuteOverlay from "@/features/simulive/components/UnmuteOverlay";

export default function LivestreamVideoPlayer({ livestreamPlaybackId }: { livestreamPlaybackId: string }) {
   const [isMuted, setIsMuted] = useState(true);

   return (
      <div className="relative bg-black rounded-lg w-auto max-h-[80dvh] aspect-video overflow-hidden">
         <UnmuteOverlay isMuted={isMuted} onClick={() => setIsMuted(false)} />
         <MuxPlayer
            playbackId={livestreamPlaybackId}
            streamType="live"
            autoPlay="any"
            muted={isMuted}
            className="w-full aspect-video"
            style={{
               "--controls": "none",
            }}
         />
      </div>
   );
}
