// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import {
//    LogOut, Mic, MicOff, ScreenShareIcon, ScreenShareOff, Video, VideoOff
// } from "lucide-react";

// function MuteMicButton () {
//    const {
//       sessionState: { sessionStream }, currentUser, setParticipantMutedStatus
//    } = useGroupRecorderContext()

//    const toggleMute = async () => {
//       if (currentUser!.isMuted) {
//          await sessionStream!.unmuteAudio()
//          setParticipantMutedStatus(currentUser!.id, false)
//          return;
//       }

//       await sessionStream!.muteAudio()
//       setParticipantMutedStatus(currentUser!.id, true)
//    }

//    return (
//       <button onClick={toggleMute}
//          className={`transition-colors duration-300 p-2 rounded-xl text-white ${currentUser!.isMuted ? "bg-red-500" : "bg-black"}`} >
//          {currentUser!.isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
//       </button>
//    )
// }

// function MuteVideoButton () {
//    const {
//       currentUser, sessionState: {
//          sessionStream, videoDeviceSelected
//       }, setParticipantVideoSharingStatus
//    } = useGroupRecorderContext()

//    const toggleVideoMute = async () => {
//       if (currentUser!.isSharingVideo) {
//          await sessionStream!.stopVideo()
//          setParticipantVideoSharingStatus(currentUser!.id, false)
//          return;
//       }

//       await sessionStream!.startVideo({
//          cameraId: videoDeviceSelected!.deviceId
//       })

//       setParticipantVideoSharingStatus(currentUser!.id, true)
//    }

//    return (
//       <button onClick={toggleVideoMute}
//          className={`transition-colors duration-300 p-2 rounded-xl text-white ${currentUser!.isSharingVideo ? "bg-black" : "bg-red-500"}`} >
//          {currentUser!.isSharingVideo ? <Video className="size-6" /> : <VideoOff className="size-6" />}
//       </button>
//    )
// }

// function ShareScreenButton () {
//    const {
//       startScreenSharing, stopScreenSharing, screenShareState: {
//          active, isLocal
//       }
//    } = useGroupRecorderContext()
//    const isSharingLocally = active && isLocal

//    const toggleScreenShare = async () => {
//       if (isSharingLocally) {
//          stopScreenSharing()
//          return;
//       }
//       startScreenSharing()
//    }

//    return (
//       <button onClick={toggleScreenShare}
//          className={`transition-colors duration-300 p-2 rounded-xl text-white ${isSharingLocally ? "bg-red-500" : "bg-black"}`} >
//          {
//             isSharingLocally ?
//                <ScreenShareOff className="size-6" /> :
//                <ScreenShareIcon className="size-6" />
//          }
//       </button>
//    )
// }

// export function LeaveSessionButton () {
//    const { leaveSession } = useGroupRecorderContext()

//    return (
//       <button onClick={leaveSession}
//          className="flex items-center gap-2 bg-red-500 p-2 rounded-xl text-white">
//          <LogOut className="size-6" />
//          <span>Salir de la sesión</span>
//       </button>
//    )
// }

// export default function SessionControlButtonsContainer () {
//    return (
//       <div>
//          <div className="flex justify-center gap-4 p-4">
//             <MuteMicButton />
//             <MuteVideoButton />
//             <ShareScreenButton />
//          </div>

//          <LeaveSessionButton />
//       </div>
//    );
// }
