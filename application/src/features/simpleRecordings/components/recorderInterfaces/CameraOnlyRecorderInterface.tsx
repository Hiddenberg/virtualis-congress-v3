"use client";
import { ArrowRight, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import DynamicZoomCallInterface from "@/features/livestreams/components/DynamicZoomCallInterface";
import RecordingLivestreamControlButtons from "../RecordingLivestreamControlButtons";

export default function CameraOnlyRecorderInterface({ sessionTitle }: { sessionTitle: string }) {
   const [username, setUsername] = useState<string>("");
   const [usernameWasSet, setUsernameWasSet] = useState<boolean>(false);

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         setUsernameWasSet(true);
      }
   };

   if (!usernameWasSet) {
      return (
         <div className="!flex !flex-col !bg-white !shadow-md !mx-auto !p-8 !rounded-xl !max-w-md">
            <div className="!flex !flex-col !gap-4">
               <div className="!mb-2 !text-center">
                  <h3 className="!font-semibold !text-gray-800 !text-xl">Bienvenido a la grabación</h3>
                  <p className="!my-2 !font-bold !text-gray-600">{sessionTitle}</p>
                  <p className="!mt-1 !text-gray-600">Ingresa tu nombre para que los demás participantes puedan identificarte</p>
               </div>

               <div className="!relative !flex !items-center">
                  <div className="!left-3 !absolute !text-gray-400">
                     <User size={18} />
                  </div>
                  <input
                     type="text"
                     value={username || ""}
                     onChange={(e) => setUsername(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="Tu nombre"
                     className="!py-3 !pr-4 !pl-10 !border !border-gray-200 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-yellow-400 !w-full"
                  />
               </div>

               <Button
                  variant="green"
                  onClick={() => setUsernameWasSet(true)}
                  disabled={!username?.trim()}
                  className="!flex !justify-center !items-center !bg-green-500 !mt-2 !p-3 !rounded-lg !w-full !font-semibold !text-white !cursor-pointer"
               >
                  Unirme a la transmisión <ArrowRight size={18} className="ml-1" />
               </Button>
            </div>
         </div>
      );
   }

   if (usernameWasSet && username) {
      return (
         <div>
            <h1 className="!mb-4 !font-bold !text-gray-900 !text-2xl">{sessionTitle}</h1>
            <RecordingLivestreamControlButtons sessionTitle={sessionTitle} />
            <DynamicZoomCallInterface initialUsername={username} allowScreenShare={true} isHostByDefault={true} />
         </div>
      );
   }
}
