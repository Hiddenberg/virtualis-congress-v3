// "use client"

// import { useRealtimeLivestreamStatusContext } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider"
// import MuxPlayer from "@mux/mux-player-react"
// import FinishedPhase from "./FinishedPhase"
// import LiveClassWaitingPhase from "./LiveWebinarWaitingPhase"

// export default function LiveClassVideoSection ({
//    currentServerTime, livestreamPlaybackId
// }: {
//    currentServerTime: string,
//    livestreamPlaybackId: string
// }) {
//    const { attendantStatus, } = useRealtimeLivestreamStatusContext()

//    if (attendantStatus === "scheduled" || attendantStatus === "preparing") {
//       return (
//          <LiveClassWaitingPhase
//             currentServerTime={currentServerTime}
//          />
//       )
//    }

//    if (attendantStatus === "streaming") {
//       return (
//          <div className="relative w-full h-full md:h-full md:max-h-[85vh] aspect-video overflow-hidden">
//             <MuxPlayer
//                style={{
//                   // Add explicit dimensions for Safari
//                   width: '100%',
//                   // height: '100%',
//                   display: 'block' // Force block display for Safari
//                } as React.CSSProperties}
//                className="rounded-lg overflow-hidden shrink-0"
//                playbackId={livestreamPlaybackId}
//                streamType="live"
//             />
//          </div>
//       )
//    }

//    if (attendantStatus === "ended") {
//       return (
//          <FinishedPhase
//             classTitle={classRecord.title}
//          />
//       )
//    }

//    return (
//       <div className="flex justify-center items-center p-8 min-h-[400px]">
//          <div className="text-center">
//             <h2 className="mb-2 font-bold text-stone-900 text-xl">Clase en vivo</h2>
//             <p className="text-stone-600">Preparando la transmisión...</p>
//          </div>
//       </div>
//    )
// }
