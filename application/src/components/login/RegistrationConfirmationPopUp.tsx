"use client";
import { PartyPopper } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../global/Buttons";
import PopUp from "../global/PopUp";

export function RegistrationConfirmationPopUp() {
   const justRegistered = useSearchParams().get("registerSuccess") === "true";
   const [showPopUp, setShowPopUp] = useState(() => justRegistered);

   if (!showPopUp) {
      return null;
   }

   return (
      <PopUp onClose={() => setShowPopUp(false)}>
         <div className="flex flex-col items-center space-y-4">
            <h2 className="font-bold text-gray-900 text-2xl">¡Felicidades!</h2>
            <div className="text-center">
               <p className="text-gray-600 text-xl">
                  Te has registrado con éxito al congreso.
               </p>
               <p className="text-gray-500">
                  Ahora puedes ingresar a tu cuenta con tu correo electrónico
                  para el proceso de pago para tu inscripción
               </p>
            </div>
            <PartyPopper className="w-12 h-12 text-yellow-400" />
            <Button
               variant="dark"
               onClick={() => setShowPopUp(false)}
               className="hover:!bg-gray-700 mt-4"
            >
               Entendido
            </Button>
         </div>
      </PopUp>
   );
}
