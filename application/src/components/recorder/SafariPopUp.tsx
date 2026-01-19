"use client";

import { useEffect, useState } from "react";
import { Button } from "../global/Buttons";
import PopUp from "../global/PopUp";

export default function SafariPopUp() {
   const [isSafari, setIsSafari] = useState(false);

   useEffect(() => {
      const detectSafari = () => {
         const userAgent = navigator.userAgent.toLowerCase();
         return (
            /safari/.test(userAgent) &&
            !/chrome/.test(userAgent) &&
            !/chromium/.test(userAgent)
         );
      };

      setIsSafari(detectSafari());
   }, []);

   if (!isSafari) {
      return null;
   }

   return (
      <PopUp onClose={() => {}} canBeClosed={true}>
         <div className="flex flex-col justify-center items-center gap-4 bg-gray-200 p-4 rounded-lg">
            <h1 className="max-w-2xl font-semibold text-2xl text-center">
               Hemos detectado que estás usando el navegador Safari.
            </h1>
            <p className="max-w-2xl font-semibold text-2xl text-center">
               Por favor, usa Google Chrome para ver las transmisiones
               correctamente.
            </p>

            <Button
               onClick={() => {
                  setIsSafari(false);
               }}
            >
               Quiero avanzar, y usar safari
            </Button>
         </div>
      </PopUp>
   );
}
