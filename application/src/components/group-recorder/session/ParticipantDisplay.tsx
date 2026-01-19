// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { GroupRecorder } from "@/types/groupRecorder";
// import { VideoPlayer, VideoQuality } from "@zoom/videosdk";
// import { User } from "lucide-react";
// import { useEffect, useRef } from "react";

// function ParticipantVideo ({ zoomId }: {zoomId: number}) {
//    const participantVideoRef = useRef(null)

//    const { sessionState: { sessionStream } } = useGroupRecorderContext()

//    useEffect(() => {
//       if (!participantVideoRef.current) return;
//       const videoPlayer = participantVideoRef.current as VideoPlayer

//       console.log("[ParticipantDisplay] Attaching video for zoomId:", zoomId)
//       sessionStream!.attachVideo(zoomId, VideoQuality.Video_360P, videoPlayer)

//       return () => {
//          sessionStream!.detachVideo(zoomId)
//       }
//    }, [])

//    return (
//    // @ts-expect-error html component
//       <video-player ref={participantVideoRef} />
//    )
// }

// function ParticipantDefaultDisplay ({ participant }: {participant: GroupRecorder.ParticipantState}) {
//    return (
//       <div className="flex flex-col flex-1 justify-center items-center bg-gray-800 p-4 rounded-xl aspect-video">
//          <div className="flex justify-center items-center bg-black mb-2 p-4 rounded-full text-white">
//             <User className="size-10" />
//          </div>
//          <p className="font-semibold text-white">{participant.displayName}</p>
//       </div>
//    )
// }

// function ParticipantDisplay ({ participant }: {participant: GroupRecorder.ParticipantState}) {
//    return (
//       <div className={`flex-1 ${participant.isTalking ? "border-2 border-green-400": ""}`}>
//          {participant.isSharingVideo ? <ParticipantVideo zoomId={participant.zoomId!} /> : <ParticipantDefaultDisplay participant={participant} />}
//       </div>
//    )
// }

// export default ParticipantDisplay;
