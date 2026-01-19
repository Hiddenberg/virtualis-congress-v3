"use client";

import { AlertCircle, Mic, Settings, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";

export const PermissionCheck = () => {
   const { micPermission, cameraPermission, permissionError } = useContext(
      ScreenRecorderContext,
   );

   const language = useSearchParams().get("language");
   const isEnglish = language === "en-US";

   // Both permissions are granted - no need to show anything
   if (micPermission === "granted" && cameraPermission === "granted") {
      return null;
   }

   return (
      <div className="space-y-4 mb-6">
         {permissionError && (
            <div
               className="relative bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700"
               role="alert"
            >
               <div className="flex items-center">
                  <AlertCircle className="mr-2 w-4 h-4" />
                  <strong className="font-bold">
                     {isEnglish ? "Permission Error" : "Error de Permisos"}
                  </strong>
               </div>
               <span className="block sm:inline mt-1">{permissionError}</span>
            </div>
         )}

         <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
               <Mic
                  className={`h-5 w-5 ${micPermission === "granted" ? "text-green-500" : "text-red-500"}`}
               />
               <span>
                  {isEnglish
                     ? "Microphone permission:"
                     : "Permiso de micrófono:"}
                  {micPermission === "granted"
                     ? isEnglish
                        ? " Granted"
                        : " Concedido"
                     : isEnglish
                       ? " Not granted"
                       : " No concedido"}
               </span>
            </div>

            <div className="flex items-center space-x-2">
               <Video
                  className={`h-5 w-5 ${cameraPermission === "granted" ? "text-green-500" : "text-red-500"}`}
               />
               <span>
                  {isEnglish ? "Camera permission:" : "Permiso de cámara:"}
                  {cameraPermission === "granted"
                     ? isEnglish
                        ? " Granted"
                        : " Concedido"
                     : isEnglish
                       ? " Not granted"
                       : " No concedido"}
               </span>
            </div>
         </div>

         {(micPermission !== "granted" || cameraPermission !== "granted") && (
            <div className="space-y-3 pt-2">
               <div className="bg-blue-50 px-4 py-3 border border-blue-200 rounded text-blue-800">
                  <div className="flex items-center">
                     <Settings className="mr-2 w-4 h-4" />
                     <strong className="font-bold">
                        {isEnglish
                           ? "If permissions were denied by accident:"
                           : "Si los permisos fueron denegados por accidente:"}
                     </strong>
                  </div>
                  <ul className="mt-1 ml-5 text-sm list-disc">
                     <li>
                        {isEnglish
                           ? "Look for the camera/microphone icon in your browser's address bar"
                           : "Busque el icono de cámara/micrófono en la barra de direcciones de su navegador"}
                     </li>
                     <li>
                        {isEnglish
                           ? "Click it and enable camera and microphone access"
                           : "Haga clic en él y habilite el acceso a la cámara y al micrófono"}
                     </li>
                     <li>
                        {isEnglish
                           ? "Refresh the page after changing permissions"
                           : "Actualice la página después de cambiar los permisos"}
                     </li>
                  </ul>
               </div>
            </div>
         )}
      </div>
   );
};
