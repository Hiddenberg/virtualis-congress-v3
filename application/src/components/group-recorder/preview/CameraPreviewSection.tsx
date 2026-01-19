// "use client"

// import { useGroupRecorderContext } from "@/contexts/GroupRecorderContext";
// import { LocalVideoTrack, VideoPlayer } from "@zoom/videosdk";
// import {
//    RefObject, useEffect, useRef, useState
// } from "react";

// function CameraPreviewContainer ({ previewVideoRef }: {previewVideoRef: RefObject<unknown>}) {
//    const [videoStarted, setVideoStarted] = useState(false)
//    const videoTrackRef = useRef<LocalVideoTrack>(null)

//    const {
//       ZoomVideo, sessionState: { videoDeviceSelected }
//    } = useGroupRecorderContext()

//    useEffect(() => {
//       if (!previewVideoRef.current) return;

//       videoTrackRef.current = ZoomVideo.createLocalVideoTrack(videoDeviceSelected!.deviceId)
//       videoTrackRef.current.start(previewVideoRef.current as VideoPlayer)
//       setVideoStarted(true)

//       return () => {
//          if (videoStarted) {
//             videoTrackRef.current!.stop()
//          }
//       }
//    }, [])

//    return (
//       // @ts-expect-error html component
//       <video-player-container className="flex *:flex-1 bg-gray-200 mx-auto rounded-xl w-auto *:w-full h-full *:h-auto max-h-[80vh] aspect-video *:aspect-video overflow-hidden *:grow">
//          {/* @ts-expect-error html component */}
//          <video-player ref={previewVideoRef} />
//          {/* @ts-expect-error html component */}
//       </video-player-container>
//    )
// }

// function CameraPreviewSection () {
//    const previewVideoRef = useRef(null)

//    return (
//       <CameraPreviewContainer previewVideoRef={previewVideoRef} />
//    );
// }

// export default CameraPreviewSection;
