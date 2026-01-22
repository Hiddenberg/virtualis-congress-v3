"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function PaymentButtons() {
   const [showPopUp, setShowPopUp] = useState(false);
   const closePopUp = () => setShowPopUp(false);

   return (
      <div className="flex flex-col justify-center items-center gap-5 mx-auto w-full md:w-2/5">
         <button type="button" className="bg-blue-200 py-3 rounded-xl w-10/12 text-xl" onClick={() => setShowPopUp(true)}>
            Ver Datos de Transferencia
         </button>

         {showPopUp && (
            <div className="top-0 left-0 fixed flex justify-center items-center bg-black/80 w-screen h-screen">
               <div className="relative bg-blue-200 p-5 rounded-xl w-11/12 h-auto">
                  <button type="button" className="top-4 right-4 absolute" onClick={closePopUp}>
                     <X />
                  </button>
                  <div className="flex flex-col justify-center items-center pt-10">
                     <h1 className="mb-12 font-medium text-blue-900 text-2xl">Datos de Transferencia</h1>

                     <div className="flex flex-col items-center gap-7 mb-auto">
                        <div className="flex flex-col gap-1">
                           <span>CLABE: XXXXXXXXXXX</span>
                        </div>

                        <div className="flex flex-col gap-1">
                           <span>Cuenta Inbursa: XXXXXXXXXXXX</span>
                        </div>

                        <div>XXXX XXXX</div>
                     </div>
                     <div className="flex justify-center pt-10 pb-7 w-full">
                        <button type="button" className="bg-white py-3 rounded-xl w-10/12">
                           Enviar Comprobante
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <button type="button" className="bg-yellow-400 py-3 rounded-xl w-10/12 text-xl">
            Pagar con Tarjeta de Débito/Crédito
         </button>
      </div>
   );
}
