"use client";
import { Award, ExternalLink } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";

export default function CertificatesBanner() {
   return (
      <div className="relative bg-linear-to-r from-gray-100 to-gray-50 shadow-md px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-2 border-purple-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
         <div
            className="absolute inset-0 pointer-events-none"
            style={{
               background: "linear-gradient(45deg, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0) 70%)",
            }}
         />
         <div className="relative flex sm:flex-row flex-col items-center gap-4 sm:gap-6">
            <div className="bg-white shadow-sm mb-3 sm:mb-0 p-2 sm:p-3 rounded-full">
               <Award className="size-8 sm:size-10 text-purple-600" />
            </div>
            <div className="flex-1 sm:text-left text-center">
               <div>
                  <p className="font-bold text-xl sm:text-2xl">Certificado de Asistencia</p>
                  <p className="mt-1 text-gray-700 text-sm sm:text-base">
                     ¡Felicidades por tu participación! Reclama tu certificado oficial que acredita tu asistencia a este congreso.
                  </p>

                  <div className="flex sm:flex-row flex-col items-center gap-3 mt-4">
                     <LinkButton
                        href="/certificates"
                        variant="primary"
                        className="inline-flex items-center gap-2 bg-purple-600! hover:bg-purple-700! text-white"
                     >
                        <ExternalLink className="size-4" />
                        Solicitar mi certificado
                     </LinkButton>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
