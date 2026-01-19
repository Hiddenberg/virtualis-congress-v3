// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client"
// /* eslint-disable @typescript-eslint/no-unused-expressions */

// import ZoomVideo, {
//    VideoPlayer, VideoQuality, VideoClient
// } from "@zoom/videosdk";
// import {
//    Mic, MicOff, ScreenShare, ScreenShareOff, Video, VideoOff
// } from "lucide-react";
// import {
//    useEffect, useRef, useState
// } from "react";

// function ZoomInterface ({ zoomJWT }: {zoomJWT: string}) {
//    const [zoomClient, setZoomClient] = useState<typeof VideoClient | null>(null);

//    const sessionName = "virtualist-test";

//    const [isVideoMuted, setIsVideoMuted] = useState(false);
//    const [isAudioMuted, setIsAudioMuted] = useState(false);
//    const [inSession, setInSession] = useState(false);
//    const [someoneIsSharingScreen, setSomeoneIsSharingScreen] = useState(false);
//    const [userSharingScreen, setUserSharingScreen] = useState<string | null>(null);
//    const [sharingMyScreen, setSharingMyScreen] = useState(false);
//    const videoContainerRef = useRef<HTMLDivElement>(null);
//    const screenShareVideoRef = useRef<HTMLVideoElement>(null);
//    const screenShareCanvasRef = useRef<HTMLCanvasElement>(null);

//    useEffect(() => {
//       setZoomClient(ZoomVideo.createClient());
//    },[])

//    if (!zoomClient) {
//       return <h1>Loading zoom client...</h1>;
//    }

//    interface RenderVideoPayload {
//       action: "Start" | "Stop";
//       userId: number;
//    }
//    const renderVideo = async ({
//       action, userId
//    }: RenderVideoPayload) => {
//       console.log("[ZoomInterface] Rendering video action:", action, "for userId:", userId);
//       const mediaStream = zoomClient.getMediaStream();
//       if (action === "Stop") {
//          const element = await mediaStream.detachVideo(userId);
//          Array.isArray(element)
//             ? element.forEach((el) => el.remove())
//             : element.remove();
//       } else {
//          const userVideo = await mediaStream.attachVideo(userId, VideoQuality.Video_360P);
//          videoContainerRef.current!.appendChild(userVideo as VideoPlayer);
//       }
//    };

//    const joinSession = async () => {
//       await zoomClient.init("es-MX", "Global", {
//          patchJsMedia: true,
//          leaveOnPageUnload: true,
//          stayAwake: true,
//       });
//       zoomClient.on("peer-video-state-change", renderVideo);

//       zoomClient.on("active-share-change", ({
//          state, userId
//       }) => {
//          if (state === "Active") {
//             if (!sharingMyScreen) {
//                zoomClient.getMediaStream()
//                   .startShareView(screenShareCanvasRef.current!, userId);
//             }
//          } else if (state === "Inactive") {
//             zoomClient.getMediaStream()
//                .stopShareView()
//          }
//       })

//       zoomClient.on("peer-share-state-change", ({
//          action, userId
//       }) => {
//          if (action === "Start") {
//             setSomeoneIsSharingScreen(true);
//             setUserSharingScreen(zoomClient.getUser(userId)!.displayName);
//          } else if (action === "Stop") {
//             setSomeoneIsSharingScreen(false);
//             setUserSharingScreen(null);
//          }
//       })

//       let userName = prompt("Introduce tu nombre");
//       if (!userName) {
//          userName = "Generic User";
//       }

//       await zoomClient.join(sessionName, zoomJWT, userName)
//       setInSession(true);

//       // Starting the video and audio
//       const mediaStream = zoomClient.getMediaStream();
//       await mediaStream.startAudio();
//       await mediaStream.startVideo();
//       const userInfo = zoomClient.getCurrentUserInfo()
//       setIsAudioMuted(userInfo.muted ?? true);
//       setIsVideoMuted(!userInfo.bVideoOn)

//       // Rendering the video
//       await renderVideo({
//          action: "Start",
//          userId: userInfo.userId
//       })
//    }

//    const shareScreen = async () => {
//       if (someoneIsSharingScreen) {
//          alert(`${userSharingScreen} is already sharing the screen`);
//          return;
//       }

//       const mediaStream = zoomClient.getMediaStream();

//       await mediaStream.startShareScreen(screenShareVideoRef.current!);
//       setSharingMyScreen(true);
//    }

//    const stopScreenShare = async () => {
//       const mediaStream = zoomClient.getMediaStream();

//       await mediaStream.stopShareScreen();
//       setSharingMyScreen(false);
//    }

//    const leaveSession = async () => {
//       zoomClient.off("peer-video-state-change", renderVideo);
//       await zoomClient.leave();

//       videoContainerRef.current!.childNodes.forEach((node) => {
//          node.remove();
//       });
//       setInSession(false);
//    }

//    const toggleVideo = async () => {
//       const mediaStream = zoomClient.getMediaStream();
//       const userId = zoomClient.getCurrentUserInfo().userId

//       if (isVideoMuted) {
//          await mediaStream.startVideo();
//          setIsVideoMuted(false);
//          await renderVideo({
//             action: "Start",
//             userId
//          })

//          return;
//       }

//       await mediaStream.stopVideo();
//       setIsVideoMuted(true);
//       await renderVideo({
//          action: "Stop",
//          userId
//       })
//    }

//    const toggleAudio = async () => {
//       const mediaStream = zoomClient.getMediaStream();

//       if (isAudioMuted) {
//          await mediaStream.unmuteAudio();
//          setIsAudioMuted(false);
//          return;
//       }

//       await mediaStream.muteAudio();
//       setIsAudioMuted(true);
//    }

//    return (
//       <div>
//          <p className="mb-4">Session: <strong>{sessionName}</strong>  {inSession ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>}</p>
//          <div className="bg-black mx-auto mb-4 rounded-xl max-w-full max-h-[80vh] aspect-video overflow-hidden">
//             {/* @ts-expect-error html component */}
//             <video-player-container ref={videoContainerRef} />
//          </div>

//          <div className={`${!sharingMyScreen && "hidden"}`}>
//             <video ref={screenShareVideoRef}
//                className="w-full aspect-video"
//             />
//          </div>

//          <div className={`${!sharingMyScreen && someoneIsSharingScreen ? "block" : "hidden"}`}>
//             <canvas ref={screenShareCanvasRef}
//                className="w-full aspect-video"
//             />
//          </div>

//          {/* {
//             inSession && (
//                <div className="flex justify-center gap-4 mb-4">
//                   <button className="bg-black p-4 rounded-lg text-white" onClick={toggleVideo}>
//                      {isVideoMuted ? <VideoOff className="size-5" /> : <Video className="size-5" />}
//                   </button>
//                   <button className="bg-black p-4 rounded-lg text-white" onClick={toggleAudio}>
//                      {isAudioMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
//                   </button>

//                   <button className={`p-4 rounded-lg text-white ${sharingMyScreen ? "bg-red-500" : "bg-black"}`} onClick={sharingMyScreen ? stopScreenShare : shareScreen}>
//                      {sharingMyScreen ? <ScreenShareOff className="size-5" /> : <ScreenShare className="size-5" />}
//                   </button>
//                </div>
//             )
//          } */}

//          <div className="flex justify-center">
//             {/* <button classNcleame={`duration-500 px-8 p-4 rounded-xl text-center text-white transition-all ${inSession ? "bg-red-500" : "bg-black"}`} onClick={inSession ? leaveSession : joinSession}>{inSession ? "Leave Session" : "Join Session"}</button> */}
//          </div>
//       </div>
//    );
// }

// export default ZoomInterface;
