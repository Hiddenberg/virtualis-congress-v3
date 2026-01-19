"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../global/Buttons";
import PopUp from "../global/PopUp";

export function RecordingCompletedPopUp() {
   const [isOpen, setIsOpen] = useState(true);
   const searchParams = useSearchParams();
   const language = searchParams.get("language");

   const texts = {
      "en-US": {
         title: "Recording Completed",
         warning:
            "This video has already been recorded. If you record again, the previous recording will be lost.",
         button: "Record again",
      },
      "es-MX": {
         title: "Grabación Completada",
         warning:
            "Este video ya ha sido grabado, si vuelves a grabar, se perderá la grabación anterior.",
         button: "Volver a grabar",
      },
   };

   const currentTexts = texts[language === "en-US" ? "en-US" : "es-MX"];

   if (!isOpen) return null;

   return (
      <PopUp
         onClose={() => {
            setIsOpen(false);
         }}
      >
         <div className="flex flex-col items-center">
            <h1 className="mb-4 font-semibold text-3xl text-center">
               {currentTexts.title}
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-red-400 text-2xl text-center">
               {currentTexts.warning}
            </p>

            <Button variant="dark" onClick={() => setIsOpen(false)}>
               {currentTexts.button}
            </Button>
         </div>
      </PopUp>
   );
}
