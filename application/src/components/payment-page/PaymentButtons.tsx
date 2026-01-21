"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function PaymentButtons() {
   const [showPopUp, setShowPopUp] = useState(false);
   const closePopUp = () => setShowPopUp(false);

   return (
      <div className="flex flex-col w-full mx-auto justify-center items-center gap-5 md:w-2/5">
         <button className="w-10/12 py-3 bg-blue-200 rounded-xl text-xl" onClick={() => setShowPopUp(true)}>
            Ver Datos de Transferencia
         </button>

         {showPopUp && (
            <div className="fixed top-0 left-0 flex justify-center items-center bg-black/80 w-screen h-screen">
               <div className="bg-blue-200 w-11/12 h-auto rounded-xl p-5 relative">
                  <button className="absolute top-4 right-4" onClick={closePopUp}>
                     <X />
                  </button>
                  <div className="flex flex-col justify-center items-center pt-10">
                     <h1 className="text-blue-900 text-2xl font-medium mb-12">Datos de Transferencia</h1>

                     <div className="flex flex-col gap-7 mb-auto items-center">
                        <div className="flex flex-col gap-1">
                           <span>CLABE: XXXXXXXXXXX</span>
                        </div>

                        <div className="flex flex-col gap-1">
                           <span>Cuenta Inbursa: XXXXXXXXXXXX</span>
                        </div>

                        <div>XXXX XXXX</div>
                     </div>
                     <div className="pt-10 w-full flex justify-center pb-7">
                        <button className="w-10/12 py-3 bg-white rounded-xl">Enviar Comprobante</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <button className="w-10/12 py-3 bg-yellow-400 rounded-xl text-xl">Pagar con Tarjeta de Débito/Crédito</button>
      </div>
   );
}
