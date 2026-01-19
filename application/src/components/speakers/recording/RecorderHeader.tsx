"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";
import HowToRecordOnZoomPopUp from "./HowToRecordOnZoomPopUp";

export default function RecorderHeader() {
   const searchParams = useSearchParams();
   const pathName = usePathname();
   const router = useRouter();
   const showTutorial = searchParams.get("showTutorial") === "true";
   const [showAlternative, setShowAlternative] = useState(false);
   const language = searchParams.get("language");

   const tutorialUrls = {
      "en-US":
         "https://drive.google.com/file/d/1mhp3dqRfnWEhGULirv2APIuiZlGGJLsp/preview",
      "es-MX":
         "https://drive.google.com/file/d/1Wc_EpmGhgEJ8AYhoUIRXyU99EgzI_poQ/preview",
   };

   const tutorialUrl =
      language && language === "en-US"
         ? tutorialUrls["en-US"]
         : tutorialUrls["es-MX"];

   return (
      <div className="relative flex justify-between items-center mx-auto mb-6 max-w-screen-xl">
         <h1 className="text-2xl">
            <strong>Virtualis </strong>Recorder
         </h1>

         <div className="top-0 left-0 absolute flex justify-center items-center w-full">
            <Button
               variant="dark"
               onClick={() => {
                  setShowAlternative(true);
               }}
            >
               {language === "en-US" ? "Alternative" : "Alternativa"}
            </Button>
         </div>

         <Button
            onClick={() => {
               router.push(
                  `${pathName}?showTutorial=true&language=${language || "es-MX"}`,
               );
            }}
            className="z-10 !bg-blue-500 hover:!bg-blue-600 !text-white"
         >
            {language === "en-US" ? "Watch tutorial" : "Ver tutorial"}
         </Button>

         {showAlternative && (
            <HowToRecordOnZoomPopUp
               onClose={() => {
                  setShowAlternative(false);
               }}
               language={language || "es-MX"}
            />
         )}

         {showTutorial && (
            <PopUp
               onClose={() => {
                  router.push(
                     `${pathName}?showTutorial=false&language=${language || "es-MX"}`,
                  );
               }}
            >
               <h1 className="mb-2 font-bold text-2xl text-center">Tutorial</h1>
               <iframe
                  className="w-full h-auto aspect-video"
                  src={tutorialUrl}
                  width="640"
                  height="480"
                  allow="autoplay"
               />
            </PopUp>
         )}
      </div>
   );
}
