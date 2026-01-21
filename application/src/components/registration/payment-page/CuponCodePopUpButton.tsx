"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";

export default function CuponCodePopUpButton() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div>
         <Button variant="blue" onClick={() => setIsOpen(true)} className="w-full">
            Tengo un código de invitación o descuento
         </Button>

         {isOpen && (
            <PopUp onClose={() => setIsOpen(false)}>
               <div className="flex flex-col items-center gap-4">
                  <h1 className="font-bold text-2xl">Como aplicar un código de invitación o descuento</h1>
                  <p>
                     Si tienes un código de invitación o descuento, puedes aplicarlo en el siguiente campo al momento de realizar
                     tu pago.
                  </p>

                  {/* Desktop Image */}
                  <Image
                     src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742837349/59baa75a-06e5-42b0-85c8-9fdb4064ae0c.png"
                     alt="Código de invitación o descuento"
                     width={1068}
                     height={941}
                     className="hidden md:block shadow-md p-4 rounded-xl w-2/3 h-auto"
                  />

                  {/* Mobile Image */}
                  <Image
                     src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1742835819/e76262b8-980e-4809-9da9-405b2b0d1fe0.png"
                     alt="Código de invitación o descuento"
                     width={388}
                     height={722}
                     className="md:hidden block shadow-md p-4 rounded-xl w-full h-auto"
                  />

                  <Button variant="dark" onClick={() => setIsOpen(false)}>
                     Entendido
                  </Button>
               </div>
            </PopUp>
         )}
      </div>
   );
}
