"use client";

import { CheckCircle, UploadCloudIcon } from "lucide-react";
import { useContext } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";

type UploadingScreenProps = {
   language?: string;
};

export default function UploadingScreen({
   language = "es-MX",
}: UploadingScreenProps) {
   const {
      isSharingScreen,
      cameraUploadProgress,
      screenUploadProgress,
      isCameraUploadCompleted,
      isScreenUploadCompleted,
   } = useContext(ScreenRecorderContext);

   const texts = {
      "en-US": {
         title: "Uploading...",
         instruction: "Please wait while your video is being uploaded.",
         instruction2:
            "This may take several minutes depending on the video duration and your internet speed.",
         importantWarning:
            "Important: Please do not close this page until the upload is complete.",
         progress: "Progress",
         cameraLabel: "Camera video",
         screenLabel: "Screen recording",
         completed: "Completed",
      },
      "es-MX": {
         title: "Subiendo...",
         instruction: "Espera un momento mientras se sube tu video.",
         instruction2:
            "Esto puede tardar varios minutos dependiendo la duración del video y tu velocidad de internet.",
         importantWarning:
            "¡Importante: Por favor no cierre esta página hasta que la subida esté completa!",
         progress: "Progreso",
         cameraLabel: "Video de cámara",
         screenLabel: "Grabación de pantalla",
         completed: "Completado",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   return (
      <div className="flex flex-col justify-center items-center bg-white shadow-lg mx-auto mt-10 p-8 rounded-xl w-full max-w-screen-lg">
         <div className="mb-8 text-center">
            <h2 className="flex justify-center items-center mb-3 font-bold text-gray-800 text-xl">
               <UploadCloudIcon className="mr-2 size-6 animate-bounce" />{" "}
               {currentTexts.title}
            </h2>
            <p className="mt-3 mb-4 font-xl font-semibold text-amber-600">
               {currentTexts.importantWarning}
            </p>
            <p className="text-gray-600">{currentTexts.instruction}</p>
            <p className="mt-2 text-gray-600">{currentTexts.instruction2}</p>
         </div>

         <div className="space-y-6 w-full max-w-md">
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg">
               <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-700">
                     {currentTexts.cameraLabel}
                  </p>
                  {isCameraUploadCompleted ? (
                     <div className="flex items-center text-green-600">
                        <CheckCircle size={18} className="mr-1" />
                        <span>{currentTexts.completed}</span>
                     </div>
                  ) : (
                     <p className="font-medium text-blue-600">
                        {cameraUploadProgress}%
                     </p>
                  )}
               </div>
               <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                     style={{
                        width: `${cameraUploadProgress}%`,
                     }}
                     className={`h-full transition-all duration-300 ${
                        isCameraUploadCompleted ? "bg-green-500" : "bg-blue-500"
                     }`}
                  />
               </div>
            </div>

            {isSharingScreen && (
               <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                     <p className="font-medium text-gray-700">
                        {currentTexts.screenLabel}
                     </p>
                     {isScreenUploadCompleted ? (
                        <div className="flex items-center text-green-600">
                           <CheckCircle size={18} className="mr-1" />
                           <span>{currentTexts.completed}</span>
                        </div>
                     ) : (
                        <p className="font-medium text-blue-600">
                           {screenUploadProgress}%
                        </p>
                     )}
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                     <div
                        style={{
                           width: `${screenUploadProgress}%`,
                        }}
                        className={`h-full transition-all duration-300 ${
                           isScreenUploadCompleted
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }`}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
