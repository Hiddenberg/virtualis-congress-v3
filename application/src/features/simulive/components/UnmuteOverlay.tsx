"use client";

import { Volume2Icon } from "lucide-react";
import { Button } from "@/components/global/Buttons";

export default function UnmuteOverlay({
   isMuted,
   onClick,
}: {
   isMuted: boolean;
   onClick: () => void;
}) {
   if (!isMuted) return null;
   return (
      <div className="z-10 absolute inset-0 flex justify-center items-center bg-black/80 w-full h-full">
         <div className="text-center">
            <Button
               onClick={onClick}
               title="Unmute"
               variant="none"
               className="bg-white text-black"
            >
               <Volume2Icon className="w-5 h-5" />
               <span>Activar sonido</span>
            </Button>
         </div>
      </div>
   );
}
