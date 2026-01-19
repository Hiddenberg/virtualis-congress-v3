"use client";

import Link from "next/link";
import { useState } from "react";

export function PresentationVideo() {
   const [isOpen, setIsOpen] = useState(true);

   if (!isOpen) {
      return null;
   }

   return (
      <div className="fixed inset-0 w-screen h-screen">
         <div className="bg-[#17181E] mx-auto -mt-10 px-4 pt-10 w-screen max-w-screen-xl h-screen">
            <h1 className="mx-auto mb-20 w-max text-white text-3xl">
               <strong>Virtualis</strong> congress
            </h1>

            <h2 className="block mx-auto mb-10 px-4 font-bold text-[#A4A1B1] text-3xl">
               Domina un nuevo idioma con nuestra metodología práctica y
               efectiva
            </h2>

            <iframe
               className="mb-10 w-full h-auto aspect-video"
               src="https://drive.google.com/file/d/1npB5KT8VWZJNXdlMSd8mjwK3O83ZECuN/preview"
               width="640"
               height="480"
               allow="autoplay"
            />

            <Link
               href="/registro"
               onClick={() => setIsOpen(false)}
               className="bg-transparent mx-auto px-4 py-2 border border-white rounded-full w-max text-white text-xl"
            >
               Conoce Más
            </Link>
         </div>
      </div>
   );
}
