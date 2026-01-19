"use client";
import {
   Check,
   Pause,
   Play,
   PlaySquareIcon,
   Repeat,
   UploadCloud,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";
import { formatVideoTime } from "@/utils/recorderUtils";

type SynchronizedPlayerControlsProps = {
   language?: string;
};

// Review message component
const ReviewMessage = ({ language }: { language: string }) => {
   const texts = {
      "en-US":
         "Here you can review your recording to make sure you like it before uploading it to the platform.",
      "es-MX":
         "Aquí puedes revisar tu grabación para asegurarte de que te gusta como quedó antes de subirla a la plataforma.",
   };

   return (
      <p className="bg-gray-100 mx-auto mt-4 p-2 rounded-lg max-w-xl font-semibold text-red-400 text-center">
         {texts[language === "en-US" ? "en-US" : "es-MX"]}
      </p>
   );
};

// Test instructions component
const TestInstructionsMessage = ({ language }: { language: string }) => {
   const texts = {
      "en-US":
         "Please verify that your camera, audio, and shared screen video are recording correctly before continuing.",
      "es-MX":
         "Por favor revisa que tu cámara, el audio, y el video de tu pantalla compartida se estén grabando correctamente antes de continuar.",
   };

   return (
      <p className="bg-gray-100 mt-4 p-2 rounded-lg max-w-xl font-semibold text-red-400 text-center">
         {texts[language === "en-US" ? "en-US" : "es-MX"]}
      </p>
   );
};

function SynchronizedPlayerControls({
   language = "es-MX",
}: SynchronizedPlayerControlsProps) {
   const {
      cameraVideoRef,
      screenVideoRef,
      resetRecorder,
      uploadVideos,
      confirmTestRecording,
   } = useContext(ScreenRecorderContext);

   const { secondsRecorded, isPresentation, isInitialTestCompleted } =
      useContext(ScreenRecorderContext);
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);

   const [userCheckedTheRecording, setUserCheckedTheRecording] =
      useState(false);

   const texts = {
      "en-US": {
         recordAgain: "Record again",
         uploadPlatform: "Upload to platform",
         confirmTest: "Everything works well",
         repeatTest: "Repeat test",
      },
      "es-MX": {
         recordAgain: "Volver a grabar",
         uploadPlatform: "Subir a la plataforma",
         confirmTest: "Todo funciona bien",
         repeatTest: "Repetir prueba",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   // Use one of the videos (e.g., the screen) as the "master"
   // for tracking currentTime and duration.
   useEffect(() => {
      const cameraVideo = cameraVideoRef.current;
      if (!cameraVideo) return;

      // Update currentTime while playing
      const handleTimeUpdate = () => {
         setCurrentTime(cameraVideo.currentTime);
      };

      cameraVideo.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
         cameraVideo.removeEventListener("timeupdate", handleTimeUpdate);
      };
   }, [cameraVideoRef, screenVideoRef]);

   const handlePlay = () => {
      if (!userCheckedTheRecording) {
         setUserCheckedTheRecording(true);
      }

      const cameraVideo = cameraVideoRef.current;
      if (!cameraVideo) return;
      cameraVideo.play();

      const screenVideo = screenVideoRef.current;
      if (screenVideo !== null) {
         screenVideo.play();
      }

      setIsPlaying(true);
   };

   const handlePause = () => {
      const cameraVideo = cameraVideoRef.current;
      if (cameraVideo === null) return;
      cameraVideo.pause();

      const screenVideo = screenVideoRef.current;
      if (screenVideo !== null) {
         screenVideo.pause();
      }

      setIsPlaying(false);
   };

   const handleSeek = (value: number) => {
      const cameraVideo = cameraVideoRef.current;
      if (cameraVideo === null) return;

      cameraVideo.currentTime = value;
      const screenVideo = screenVideoRef.current;
      if (screenVideo !== null) {
         screenVideo.currentTime = value;
      }
      setCurrentTime(value);
   };

   if (isPresentation)
      return (
         <div>
            <ReviewMessage language={language} />

            <p className="py-4 font-semibold text-xl text-center">
               {formatVideoTime(currentTime)} /{" "}
               {formatVideoTime(secondsRecorded)}
            </p>

            <div className="flex flex-col items-center mt-2">
               {/* Custom "scrub" slider (for demonstration) */}
               <input
                  type="range"
                  min={0}
                  max={secondsRecorded}
                  step="1"
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="mb-2 w-5/6 accent-black"
               />

               {isPlaying ? (
                  <button
                     className="p-2 border rounded-lg"
                     onClick={handlePause}
                  >
                     <Pause className="size-8" />
                  </button>
               ) : (
                  <button
                     className="flex items-center gap-2 p-2 border rounded-lg"
                     onClick={handlePlay}
                  >
                     <Play className="size-8" />
                     {language === "en-US"
                        ? "Review recording"
                        : "Revisar grabación"}
                  </button>
               )}

               <div className="flex gap-2 my-4 *:w-64">
                  {/* <div className="flex items-center gap-2 mt-4">
                  <button onClick={downloadVideos} className="flex items-center gap-2 bg-white p-4 px-6 border rounded-lg"><Download className="size-5" />
                     Descargar
                  </button>

               </div> */}
                  <button
                     onClick={resetRecorder}
                     disabled={!userCheckedTheRecording}
                     className="flex justify-center items-center gap-2 bg-white disabled:bg-gray-400 p-4 px-6 border rounded-lg disabled:text-white"
                  >
                     <PlaySquareIcon className="size-5" />
                     {currentTexts.recordAgain}
                  </button>

                  <button
                     onClick={uploadVideos}
                     disabled={!userCheckedTheRecording}
                     className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 p-4 rounded-lg text-white"
                  >
                     <UploadCloud className="size-5" />
                     {currentTexts.uploadPlatform}
                  </button>
               </div>
            </div>
         </div>
      );

   return (
      <div>
         {isInitialTestCompleted && <ReviewMessage language={language} />}
         <p className="py-4 font-semibold text-xl text-center">
            {formatVideoTime(currentTime)} / {formatVideoTime(secondsRecorded)}
         </p>

         <div className="flex flex-col items-center mt-2">
            {/* Custom "scrub" slider (for demonstration) */}
            <input
               type="range"
               min={0}
               max={secondsRecorded}
               step="1"
               value={currentTime}
               onChange={(e) => handleSeek(Number(e.target.value))}
               className="mb-2 w-5/6 accent-black"
            />

            {isPlaying ? (
               <button className="p-2 border rounded-lg" onClick={handlePause}>
                  <Pause className="size-8" />
               </button>
            ) : (
               <button
                  className="flex items-center gap-2 p-2 border rounded-lg"
                  onClick={handlePlay}
               >
                  <Play className="size-8" />
                  {language === "en-US"
                     ? "Review recording"
                     : "Revisar grabación"}
               </button>
            )}

            {!isInitialTestCompleted && (
               <TestInstructionsMessage language={language} />
            )}

            <div className="flex gap-2 my-4 *:w-64">
               {/* <div className="flex items-center gap-2 mt-4">
                     <button onClick={downloadVideos} className="flex items-center gap-2 bg-white p-4 px-6 border rounded-lg"><Download className="size-5" />
                        Descargar
                     </button>
   
                  </div> */}

               {isInitialTestCompleted ? (
                  <button
                     onClick={resetRecorder}
                     disabled={!userCheckedTheRecording}
                     className="flex justify-center items-center gap-2 bg-white disabled:bg-gray-400 p-4 px-6 border rounded-lg disabled:text-white"
                  >
                     <PlaySquareIcon className="size-5" />
                     {currentTexts.recordAgain}
                  </button>
               ) : (
                  <button
                     onClick={resetRecorder}
                     className="flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 p-4 rounded-lg text-white"
                  >
                     <Repeat className="size-5" />
                     {currentTexts.repeatTest}
                  </button>
               )}

               {isInitialTestCompleted ? (
                  <button
                     onClick={uploadVideos}
                     disabled={!userCheckedTheRecording}
                     className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 p-4 rounded-lg text-white"
                  >
                     <UploadCloud className="size-5" />
                     {currentTexts.uploadPlatform}
                  </button>
               ) : (
                  <button
                     onClick={confirmTestRecording}
                     className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 p-4 rounded-lg text-white"
                  >
                     <Check className="size-5" />
                     {currentTexts.confirmTest}
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}

export default SynchronizedPlayerControls;
