"use client";

import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import PopUp from "@/components/global/PopUp";

export function NonExistingACPIDMessage({ acpId }: { acpId: string }) {
   const [buttonClicked, setButtonClicked] = useState(false);

   if (buttonClicked) {
      return (
         <div className="space-y-4">
            <p>
               El ACP ID <strong>{acpId}</strong> no se encuentra en nuestra
               base de datos.
            </p>
            <p>
               Debido a que su membresía pertenece al ACP global con sede en
               Estados Unidos, Nosotros desde México no tenemos ninguna
               injerencia en el tiempo que ellos tardan en actualizar su base de
               datos con nuevos miembros
            </p>
            <p>
               Por esa razón, es que aunque nosotros actualizamos los nuevos
               miembros que se inscriben diariamente al ACP, es posible que el
               ACP ID que ingresaste no se encuentre en nuestra base de datos.
            </p>
            <p>
               El ACP global puede llegar a tardar más de 72 horas en actualizar
               el registro oficial en su base de datos.
            </p>
            <p>
               Por favor, espera a que el ACP actualice su base de datos y
               vuelve a intentarlo.
            </p>
            <p>
               Seguiremos intentando buscar el momento en que suban su
               membresía, pero por favor tome en cuenta que esto no depende de
               México.
            </p>
         </div>
      );
   }

   return (
      <>
         <div>
            <p>
               El ACP ID <strong>{acpId}</strong> no se encuentra en nuestra
               base de datos.
            </p>
            <p>
               Por favor, comprueba que el ID es correcto y vuelve a intentarlo.
            </p>
         </div>

         <div className="space-y-4 bg-gray-100 shadow-sm p-2 rounded-md">
            <p>¿Te afiliaste al ACP dentro de los ultimos 5 días?</p>

            <Button onClick={() => setButtonClicked(true)} className="mx-auto">
               Soy Recien Afiliado
            </Button>
         </div>
      </>
   );
}

export function BlackListedACPIDMessage({ acpId }: { acpId: string }) {
   return (
      <>
         <p>
            Hemos detectado que su ACP ID <strong>{acpId}</strong> está
            vinculado a una membresía inactiva por falta de pago
         </p>

         <p>
            Por favor, contacta a la institución para actualizar tu membresía, o
            continua el registro usando el botón &quot;Continuar sin ACP
            ID&quot;
         </p>
      </>
   );
}

export default function InvalidACPIDPopUp({
   acpId,
   isBlackListed,
   setShowPopUp,
}: {
   acpId: string;
   isBlackListed: boolean;
   setShowPopUp: (showPopUp: boolean) => void;
}) {
   console.log("[InvalidACPIDPopUp] Is blacklisted status:", isBlackListed);

   return (
      <PopUp onClose={() => setShowPopUp(false)}>
         <div className="space-y-4 mx-auto max-w-xl text-black text-lg">
            {isBlackListed ? (
               <BlackListedACPIDMessage acpId={acpId} />
            ) : (
               <NonExistingACPIDMessage acpId={acpId} />
            )}
         </div>
      </PopUp>
   );
}
