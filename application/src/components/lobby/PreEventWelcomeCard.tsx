"use client";
import { AlarmClockCheckIcon, Check, Link2 } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton() {
   const [isCopied, setIsCopied] = useState(false);

   const handleCopyLink = () => {
      navigator.clipboard.writeText("https://acp-congress.virtualis.app/lobby");

      setIsCopied(true);
      setTimeout(() => {
         setIsCopied(false);
      }, 800);
   };
   return (
      <button
         onClick={handleCopyLink}
         className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 px-6 py-2 rounded-xl font-semibold"
      >
         {isCopied ? (
            <Check className="size-5" />
         ) : (
            <Link2 className="size-5" />
         )}
         {isCopied ? "Copiado" : "Copiar Enlace"}
      </button>
   );
}

export default function PreEventWelcomeCard() {
   return (
      <div className="flex items-center bg-gray-100 px-8 py-8 rounded-3xl">
         <div className="flex items-center gap-6">
            <AlarmClockCheckIcon className="size-10 text-gray-700 shrink-0" />
            <div>
               <div className="mb-4">
                  <p className="font-bold text-2xl">
                     ¡Ya estás inscrito! El evento está por comenzar
                  </p>
                  <p>
                     Te recomendamos guardar esta página en tus favoritos o
                     copiar el siguiente enlace para tenerlo siempre a mano
                     cuando el evento comience.
                  </p>
               </div>

               <CopyLinkButton />
            </div>
         </div>
      </div>
   );
}
