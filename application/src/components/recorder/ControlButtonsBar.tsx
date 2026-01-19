"use client";

import {
   Camera,
   Mic,
   Play,
   ScreenShare,
   ScreenShareOff,
   Square,
   Timer,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";
import { Button } from "../global/Buttons";
import MacOsDetectionPopUp from "../global/MacOsDetectionPopUp";
import HowToSharePresentationPopUp from "../speakers/recording/HowToSharePresentationPopUp";
import Countdown from "./Countdown";
import { StartingTestRecordingPopUp } from "./StartingTestRecordingPopUp";

function ControlButton({
   children,
   className,
   onClick,
   disabled = false,
}: {
   children: React.ReactNode;
   className?: string;
   onClick: () => void;
   disabled?: boolean;
}) {
   const [clicked, setClicked] = useState(false);

   const handleClick = () => {
      setClicked(true);
      onClick();
   };

   return (
      <button
         onClick={handleClick}
         disabled={disabled || clicked}
         className={`p-3 px-5 border rounded-lg font-semibold ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
         {children}
      </button>
   );
}

type ComponentWithLanguageProps = {
   language?: string;
};

function RecordScreenButton({
   language = "es-MX",
}: ComponentWithLanguageProps) {
   const { startScreenShare, stopScreenShare, isSharingScreen } = useContext(
      ScreenRecorderContext,
   );
   const [
      isHowToSharePresentationPopUpOpen,
      setIsHowToSharePresentationPopUpOpen,
   ] = useState(false);

   const texts = {
      "en-US": {
         stopScreen: "Stop screen sharing",
         startScreen: "Share screen",
      },
      "es-MX": {
         stopScreen: "Detener pantalla",
         startScreen: "Compartir pantalla",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   const handleStartScreenShare = () => {
      if (isSharingScreen) {
         stopScreenShare();
      } else {
         setIsHowToSharePresentationPopUpOpen(true);
      }
   };

   return (
      <div>
         <button
            onClick={handleStartScreenShare}
            className="flex justify-center items-center gap-2 p-3 px-5 border rounded-lg w-full font-semibold"
         >
            {isSharingScreen ? (
               <ScreenShareOff className="size-5 text-red-500" />
            ) : (
               <ScreenShare className="size-5" />
            )}
            <span>
               {isSharingScreen
                  ? currentTexts.stopScreen
                  : currentTexts.startScreen}
            </span>
         </button>
         {isHowToSharePresentationPopUpOpen && (
            <HowToSharePresentationPopUp
               onClose={() => {
                  setIsHowToSharePresentationPopUpOpen(false);
                  startScreenShare();
               }}
               language={language}
            />
         )}
      </div>
   );
}

function AudioDeviceSelector() {
   const { audioDevices, audioDeviceSelected, changeAudioInputDevice } =
      useContext(ScreenRecorderContext);

   const handleAudioDeviceChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
   ) => {
      const audioDeviceId = event.target.value;
      if (audioDeviceId) {
         changeAudioInputDevice(audioDeviceId);
      }
   };

   return (
      <label className="flex justify-start items-center gap-2 p-2 border rounded-lg font-semibold">
         <Mic className="size-5" />
         <select
            value={audioDeviceSelected?.deviceId}
            onChange={handleAudioDeviceChange}
         >
            {audioDevices.map((device) => (
               <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
               </option>
            ))}
         </select>
      </label>
   );
}

function MyScreenIsNotSharingButton({
   language = "es-MX",
}: ComponentWithLanguageProps) {
   const [popUpOpen, setPopUpOpen] = useState(false);
   const [isMacOs, setIsMacOs] = useState(false);

   useEffect(() => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMac =
         userAgent.includes("macintosh") || userAgent.includes("mac os x");
      setIsMacOs(isMac);
   }, []);

   const texts = {
      "en-US": {
         button: "My screen is not sharing",
      },
      "es-MX": {
         button: "Mi pantalla no está compartiendo",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (!isMacOs) return null;

   return (
      <>
         <Button
            variant="destructive"
            className="w-full"
            onClick={() => setPopUpOpen(true)}
         >
            {currentTexts.button}
         </Button>
         {popUpOpen && (
            <MacOsDetectionPopUp
               closePopUp={() => {
                  setPopUpOpen(false);
               }}
            />
         )}
      </>
   );
}

function VideoDeviceSelector() {
   const { videoDevices, videoDeviceSelected, changeVideoInputDevice } =
      useContext(ScreenRecorderContext);

   const handleVideoDeviceChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
   ) => {
      const videoDeviceId = event.target.value;
      if (videoDeviceId) {
         changeVideoInputDevice(videoDeviceId);
      }
   };

   return (
      <label className="flex items-center gap-2 p-2 border rounded-lg font-semibold">
         <Camera className="size-5" />
         <select
            value={videoDeviceSelected?.deviceId}
            onChange={handleVideoDeviceChange}
         >
            {videoDevices.map((device) => (
               <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
               </option>
            ))}
         </select>
      </label>
   );
}

function ConfigSection({ language = "es-MX" }: ComponentWithLanguageProps) {
   const { isPresentation } = useContext(ScreenRecorderContext);

   return (
      <div className="flex justify-center items-start gap-2 p-2 w-full *:w-full *:max-w-sm *:overflow-hidden">
         <VideoDeviceSelector />
         <AudioDeviceSelector />
         {!isPresentation && (
            <div className="space-y-4">
               <RecordScreenButton language={language} />
               <MyScreenIsNotSharingButton language={language} />
            </div>
         )}
      </div>
   );
}

function RecordingButton({ language = "es-MX" }: ComponentWithLanguageProps) {
   const {
      isRecording,
      startRecording,
      stopRecording,
      micPermission,
      cameraPermission,
      isPresentation,
      isInitialTestCompleted,
   } = useContext(ScreenRecorderContext);

   const [
      isStartingTestRecordingPopUpOpen,
      setIsStartingTestRecordingPopUpOpen,
   ] = useState(false);

   const hasPermissions =
      micPermission === "granted" && cameraPermission === "granted";

   const texts = {
      "en-US": {
         stopRecording: "Stop recording",
         startRecording: "Start recording",
      },
      "es-MX": {
         stopRecording: "Detener grabación",
         startRecording: "Iniciar grabación",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (isPresentation)
      return (
         <ControlButton
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isRecording && !hasPermissions}
            className={`flex text-white transition-colors duration-300 items-center gap-2 ${isRecording ? "bg-red-500" : "bg-black"}`}
         >
            {isRecording ? (
               <Square className="size-5" />
            ) : (
               <Play className="size-5" />
            )}
            <span>
               {isRecording
                  ? currentTexts.stopRecording
                  : currentTexts.startRecording}
            </span>
         </ControlButton>
      );

   return (
      <>
         {isRecording && !isInitialTestCompleted ? null : (
            <ControlButton
               onClick={() => {
                  if (!isInitialTestCompleted) {
                     setIsStartingTestRecordingPopUpOpen(true);
                  } else {
                     if (isRecording) {
                        stopRecording();
                     } else {
                        startRecording();
                     }
                  }
               }}
               disabled={!isRecording && !hasPermissions}
               className={`flex text-white transition-colors duration-300 items-center gap-2 ${isRecording ? "bg-red-500" : "bg-black"}`}
            >
               {isRecording ? (
                  <Square className="size-5" />
               ) : (
                  <Play className="size-5" />
               )}
               <span>
                  {isRecording
                     ? currentTexts.stopRecording
                     : currentTexts.startRecording}
               </span>
            </ControlButton>
         )}

         <StartingTestRecordingPopUp
            showingPopUp={isStartingTestRecordingPopUpOpen}
            setShowingPopUp={setIsStartingTestRecordingPopUpOpen}
         />
      </>
   );
}

function DelayedRecordingButton({
   language = "es-MX",
   delayms,
}: ComponentWithLanguageProps & { delayms: number }) {
   const {
      isRecording,
      isDelayedRecordingStarted,
      startDelayedRecording,
      stopRecording,
      micPermission,
      cameraPermission,
   } = useContext(ScreenRecorderContext);

   const hasPermissions =
      micPermission === "granted" && cameraPermission === "granted";

   const texts = {
      "en-US": {
         notification:
            "You'll hear a sound 5 seconds before recording starts and when recording begins",
         countdown: "Recording will start in",
         stopRecording: "Stop recording",
         startDelayedRecording: "Start recording in 15 seconds",
      },
      "es-MX": {
         notification:
            "Escucharás un sonido 5 segundos antes de iniciar la grabación y cuando la grabación se inicie",
         countdown: "La grabación se iniciará en",
         stopRecording: "Detener grabación",
         startDelayedRecording: "Iniciar grabación en 15 segundos",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   const handleButtonClick = () => {
      if (isRecording) {
         stopRecording();
         return;
      }

      startDelayedRecording(delayms);
   };

   if (isDelayedRecordingStarted) {
      return (
         <div className="flex flex-col items-center gap-2">
            <p className="bg-gray-200 p-2 rounded-xl w-80 text-red-600 text-center">
               {currentTexts.notification}
            </p>

            <p className="font-semibold text-2xl">{currentTexts.countdown}</p>
            <Countdown duration={delayms} className="font-bold text-4xl" />
         </div>
      );
   }

   return (
      <ControlButton
         onClick={handleButtonClick}
         disabled={!isRecording && !hasPermissions}
         className={`flex text-white transition-colors duration-300 items-center gap-2 ${isRecording ? "bg-red-500" : "bg-black"}`}
      >
         {isRecording ? (
            <Square className="size-5" />
         ) : (
            <Timer className="size-5" />
         )}
         <span>
            {isRecording
               ? currentTexts.stopRecording
               : currentTexts.startDelayedRecording}
         </span>
      </ControlButton>
   );
}

function RecordControlButtons({
   language = "es-MX",
}: ComponentWithLanguageProps) {
   const { isRecording, isDelayedRecordingStarted, isInitialTestCompleted } =
      useContext(ScreenRecorderContext);

   return (
      <div className="flex flex-col *:justify-center gap-4 mx-auto p-2 max-w-sm">
         {!isDelayedRecordingStarted && !isRecording && (
            <RecordingButton language={language} />
         )}
         {isInitialTestCompleted && (
            <DelayedRecordingButton language={language} delayms={15000} />
         )}
      </div>
   );
}

export function ControlButtonsBar({
   language = "es-MX",
}: ComponentWithLanguageProps) {
   const { isRecording, isDelayedRecordingStarted } = useContext(
      ScreenRecorderContext,
   );

   return (
      <div className="space-y-4 my-4 p-2">
         {!isRecording && !isDelayedRecordingStarted && (
            <ConfigSection language={language} />
         )}
         <RecordControlButtons language={language} />
      </div>
   );
}
