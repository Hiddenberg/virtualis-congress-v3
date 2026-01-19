import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import RealtimePresentationViewer from "@/features/pptPresentations/components/realtime/RealtimePresentationViewer";
import { useRealtimePresentationState } from "@/features/pptPresentations/customHooks/useRealtimePresentationState";
import UnmuteOverlay from "@/features/simulive/components/UnmuteOverlay";

export default function LivestreamVideoAndPresentationPlayer({
   livestreamPlaybackId,
   presentationId,
}: {
   livestreamPlaybackId: string;
   presentationId: string;
}) {
   const [isMuted, setIsMuted] = useState(true);
   const { state } = useRealtimePresentationState(presentationId);

   return (
      <div className="relative bg-black px-2 rounded-lg w-auto max-h-[80dvh] aspect-video overflow-hidden">
         <UnmuteOverlay isMuted={isMuted} onClick={() => setIsMuted(false)} />
         <div className="items-center gap-2 grid grid-cols-12 h-full">
            <div
               className={`transition-all duration-300 ${state?.isHidden ? "col-span-0 w-0 overflow-hidden" : "col-span-10"}`}
            >
               <RealtimePresentationViewer
                  presentationId={presentationId}
                  showHeader={false}
               />
            </div>

            <MuxPlayer
               playbackId={livestreamPlaybackId}
               streamType="live"
               autoPlay="any"
               muted={isMuted}
               className={`w-full aspect-video transition-all duration-300 ${state?.isHidden ? "col-span-12" : "col-span-2"}`}
               style={{
                  "--controls": "none",
               }}
            />
         </div>
      </div>
   );
}
