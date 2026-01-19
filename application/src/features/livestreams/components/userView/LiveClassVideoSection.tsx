// "use client"

// import { useRealtimeLivestreamStatusContext } from "@/features/livestreams/contexts/RealtimeLivestreamStatusProvider"
// import MuxPlayer from "@mux/mux-player-react"
// import LiveClassWaitingPhase from "./LiveClassWaitingPhase"
// import PausedClassStreamPhase from "./PausedClassStreamPhase"
// import { useEffect } from "react"
// // import { useClassPageDataContext } from "@/contexts/ClassPageDataContext"

// export default function LiveClassVideoSection ({
//    // classRecord,
//    currentServerTime,
//    livestreamPlaybackId
// }: {
//    // classRecord: DBRecordItem<Class>,
//    currentServerTime: string,
//    livestreamPlaybackId: string
// }) {
//    const { attendantStatus } = useRealtimeLivestreamStatusContext()
//    // const { setClassStage } = useClassPageDataContext()

//    // useEffect(() => {
//    //    if (attendantStatus === "ended") {
//    //       setClassStage("finished")
//    //    }
//    // }, [attendantStatus, setClassStage])

//    const statusComponents: Record<LivestreamSession["status"], React.ReactNode> = {
//       scheduled: (
//          <LiveClassWaitingPhase
//             // classStartTime={classRecord.startTime}
//             currentServerTime={currentServerTime}
//          />
//       ),
//       preparing: (
//          <LiveClassWaitingPhase
//             classStartTime={classRecord.startTime}
//             currentServerTime={currentServerTime}
//          />
//       ),
//       streaming: (
//          <div className="relative w-full h-full md:h-full md:max-h-[85vh] aspect-video overflow-hidden">
//             <MuxPlayer
//                style={{
//                   // Add explicit dimensions for Safari
//                   width: '100%',
//                   // height: '100%',
//                   display: 'block' // Force block display for Safari
//                } as React.CSSProperties}
//                autoPlay={"any"}
//                className="rounded-lg overflow-hidden shrink-0"
//                playbackId={livestreamPlaybackId}
//                streamType="live"
//             />
//          </div>
//       ),
//       paused: (
//          <PausedClassStreamPhase />
//       ),
//       ended: null
//    }

//    const statusComponent = statusComponents[attendantStatus]

//    return (
//       statusComponent
//    )
// }
