"use client";

import Image from "next/image";
import { useContext } from "react";
import { ScreenRecorderContext } from "@/contexts/ScreenRecorderContext";
import { Button } from "../global/Buttons";
import PopUp from "../global/PopUp";

export function StartingTestRecordingPopUp({
   showingPopUp,
   setShowingPopUp,
}: {
   showingPopUp: boolean;
   setShowingPopUp: (showingPopUp: boolean) => void;
}) {
   const { startTestRecording } = useContext(ScreenRecorderContext);

   if (!showingPopUp) return null;

   const handleStartTestRecording = () => {
      setShowingPopUp(false);
      startTestRecording();
   };

   return (
      <PopUp onClose={() => {}} canBeClosed={false}>
         <div className="flex flex-col items-center">
            <div className="space-y-2 mb-4 text-center">
               <h1 className="font-semibold text-xl">
                  Realizaremos una prueba de grabación antes de empezar la
                  grabación de la conferencia
               </h1>
               <p>
                  Esta prueba durará <strong>10 segundos</strong> y nos ayudará
                  a asegurarnos de que todo está funcionando correctamente
               </p>
            </div>

            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg text-red-400">
               <p className="mb-4 max-w-3xl font-semibold">
                  Si necesitas compartir tu pantalla para la conferencia por
                  favor asegúrate de que la interfaz tenga la pantalla de tu
                  presentación y el video de tu cámara a un lado como en el
                  siguiente ejemplo:
               </p>
               <Image
                  src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1743447693/cam-with-presentation-example_emvfvo.png"
                  alt="Test recording example"
                  width={1257}
                  height={715}
                  className="rounded-lg w-5/6 aspect-video"
               />
            </div>
            <Button className="mt-4" onClick={handleStartTestRecording}>
               Comenzar prueba
            </Button>
         </div>
      </PopUp>
   );
}
