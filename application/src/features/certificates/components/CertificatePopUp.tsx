"use client";

import { Award, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/global/Buttons";
import PopUp from "../../../components/global/PopUp";

export default function CertificatePopUp() {
   const [isOpen, setIsOpen] = useState(true);

   return (
      <div>
         {isOpen && (
            <PopUp onClose={() => setIsOpen(false)}>
               <div className="flex flex-col justify-center items-center mx-auto p-6 max-w-md">
                  <div className="bg-purple-100 mb-4 p-3 rounded-full">
                     <Award className="size-10 text-purple-600" />
                  </div>

                  <h1 className="mb-3 font-bold text-gray-800 text-2xl text-center">
                     Certificados Disponibles Pronto
                  </h1>

                  <p className="mb-5 text-gray-600 text-center">
                     Podrás descargar tus certificados en formato PDF a partir
                     de las 9PM.
                  </p>

                  <p className="mb-5 font-semibold text-gray-600 text-center">
                     Te enviaremos una notificación cuando estén disponibles.
                  </p>

                  <Button
                     className="inline-flex justify-center items-center gap-2 mt-2 w-full"
                     onClick={() => setIsOpen(false)}
                  >
                     <CheckCircle className="size-5" />
                     Entendido
                  </Button>
               </div>
            </PopUp>
         )}
      </div>
   );
}
