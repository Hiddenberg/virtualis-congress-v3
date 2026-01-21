"use client";
import { useState } from "react";
import { Button, LinkButton } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";
export default function PayWithBankTransferButton() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <Button onClick={() => setIsOpen(true)}>Pagar con transferencia bancaria o efectivo</Button>
         {isOpen && (
            <PopUp onClose={() => setIsOpen(false)}>
               <div className="flex flex-col justify-center items-center">
                  <div className="mb-8">
                     <h2 className="mb-4 font-bold text-2xl">Instrucciones para pagar con transferencia bancaria o efectivo</h2>
                     <p className="bg-gray-200 px-4 py-2 rounded-md max-w-2xl font-semibold text-red-400 text-center">
                        Por favor, toma en cuenta que el pago con transferencia bancaria o efectivo puede tardar hasta 2 días
                        hábiles en ser confirmado.
                     </p>
                  </div>

                  <ol className="space-y-2 mb-8 max-w-xl text-lg list-decimal">
                     <li>Haz click en el botón de abajo para ir al portal de pago.</li>
                     <li>
                        Selecciona la opción de <strong>transferencia bancaria</strong> u <strong>Oxxo</strong> y haz click en el
                        botón de pagar.
                     </li>

                     <li>
                        El portal de pago te mostrará los datos de la cuenta a la que debes hacer la transferencia o el numero de
                        referencia para pagar en Oxxo.
                     </li>

                     <li>Una vez copiados estos datos puedes cerrar la página del portal de pago.</li>

                     <li>Realiza la transferencia o paga en Oxxo.</li>

                     <li>
                        Una vez que tu pago sea confirmado, recibirás un correo electrónico de confirmación con el link para
                        entrar a la plataforma.
                     </li>
                  </ol>

                  <LinkButton
                     href="/api/create-checkout-session"
                     target="_blank"
                     className="bg-yellow-400 px-4 py-3 rounded-xl w-max text-xl text-center transition-colors"
                  >
                     Realizar Pago
                  </LinkButton>
               </div>
            </PopUp>
         )}
      </>
   );
}
