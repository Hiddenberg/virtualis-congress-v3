"use client";

import { useContext, useEffect } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";

export function VideoPreviews() {
   const {
      cameraStream,
      screenStream,
      isSharingScreen,
      isStopped,
      cameraVideoUrl,
      screenVideoUrl,
      cameraVideoRef,
      screenVideoRef,
   } = useContext(ScreenRecorderContext);

   useEffect(() => {
      if (cameraVideoRef.current === null) return;
      cameraVideoRef.current.srcObject = cameraStream;

      if (isSharingScreen) {
         if (screenVideoRef.current === null) return;
         screenVideoRef.current.srcObject = screenStream;
      }

      if (isStopped) {
         cameraVideoRef.current.srcObject = null;
         cameraVideoRef.current.autoplay = false;
         cameraVideoRef.current.muted = false;
         cameraVideoRef.current.src = cameraVideoUrl!;

         if (isSharingScreen) {
            screenVideoRef.current!.srcObject = null;
            screenVideoRef.current!.autoplay = false;
            screenVideoRef.current!.src = screenVideoUrl!;
         }
      }
   }, [
      cameraStream,
      screenStream,
      isSharingScreen,
      cameraVideoUrl,
      screenVideoUrl,
      isStopped,
      cameraVideoRef,
      screenVideoRef,
   ]);

   const cameraStyles = {
      OnlyCamera: "aspect-video w-full [&>video]:object-contain",
      TopRight: "absolute top-0 right-0 aspect-square w-52 p-2",
      BottomRight: "absolute bottom-0 right-0 w-52 aspect-square p-2",
      Right: " h-full flex items-center w-1/5 [&>video]:object-cover",
   };

   return (
      <div className="relative flex items-center gap-2 bg-black p-2 rounded-xl w-full aspect-video overflow-hidden">
         {/* First video (e.g. 16:9). */}
         {isSharingScreen && (
            <div className="flex items-center w-4/5 h-full">
               <video
                  ref={screenVideoRef}
                  autoPlay
                  muted={true}
                  playsInline
                  className="w-full aspect-video"
               />
            </div>
         )}

         {/* Second video (e.g. 4:5). */}
         <div
            className={`transition-all ${cameraStyles[isSharingScreen ? "Right" : "OnlyCamera"]} 1/`}
         >
            <video
               ref={cameraVideoRef}
               autoPlay
               muted={!isStopped}
               playsInline
               className="rounded-xl w-full h-auto aspect-[4/5]"
            />
         </div>
      </div>
   );
}
