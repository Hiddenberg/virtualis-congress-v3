// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { useEffect, useRef } from "react";

// function ScreenShareDisplay () {
//    const {
//       sessionState: { sessionStream }, screenShareState, zoomClient
//    } = useGroupRecorderContext()
//    // const needsCanvas = screenShareState.isLocal || !sessionStream!.isStartShareScreenWithVideoElement()
//    const sharedScreenElementRef = useRef(null)

//    useEffect(() => {
//       const handlePassivelyStopShare = async () => {
//          await sessionStream!.stopShareScreen()
//       }

//       async function renderScreenShare () {
//          console.log("[ScreenShareDisplay] Rendering screen share")
//          if (screenShareState.isLocal) {
//             await sessionStream!.startShareScreen(sharedScreenElementRef.current!)

//             zoomClient.on("passively-stop-share", handlePassivelyStopShare)
//             return;
//          }

//          sessionStream!.startShareView(sharedScreenElementRef.current!, screenShareState.userSharing!.zoomId!)
//       }

//       renderScreenShare()

//       return () => {
//          if (screenShareState.isLocal) {
//             zoomClient.off("passively-stop-share", renderScreenShare)
//             return;
//          }

//          sessionStream!.stopShareView()
//       }
//    }, [screenShareState.isLocal, screenShareState.userSharing])

//    return (
//       <div className="flex-1">
//          <video className="w-full aspect-video"
//             ref={sharedScreenElementRef}
//             muted={true}
//             autoPlay={true}
//          />
//          {/* {
//             needsCanvas ?
//                <canvas ref={sharedScreenElementRef} /> :
//          } */}
//       </div>
//    );
// }

// export default ScreenShareDisplay;
