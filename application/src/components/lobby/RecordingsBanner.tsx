"use client";
import { Video } from "lucide-react";

export default function RecordingsBanner() {
   return (
      <div className="relative bg-gradient-to-r from-gray-100 to-gray-50 shadow-md px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-2 border-blue-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
         <div
            className="absolute inset-0 pointer-events-none"
            style={{
               background: "linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)",
            }}
         />
         <div className="relative flex sm:flex-row flex-col items-center gap-4 sm:gap-6">
            <div className="bg-white shadow-sm mb-3 sm:mb-0 p-2 sm:p-3 rounded-full">
               <Video className="size-8 sm:size-10 text-blue-600" />
            </div>
            <div className="flex-1 sm:text-left text-center">
               <div>
                  <p className="font-bold text-xl sm:text-2xl">¡Evento Finalizado!</p>
                  <p className="mt-1 text-gray-700 text-sm sm:text-base">
                     Gracias por participar en nuestro congreso. Ya puedes ver las grabaciones de todas las conferencias.
                  </p>

                  {/* <div className="flex sm:flex-row flex-col items-center gap-3 mt-4">
                     <LinkButton href="/recordings" variant="primary" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <ExternalLink className="size-4" />
                        Acceder a las grabaciones
                     </LinkButton>
                  </div> */}
               </div>
            </div>
         </div>
      </div>
   );
}
