"use client";
import { Award, Video } from "lucide-react";

export default function AttendeeWelcomeCard({ attendeeName = "", eventName = "1er Congreso Internacional De Medicina Interna" }) {
   return (
      <div className="relative bg-linear-to-r from-gray-100 to-gray-50 shadow-md px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-2 border-green-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
         <div
            className="absolute inset-0 pointer-events-none"
            style={{
               background: "linear-gradient(45deg, rgba(74, 222, 128, 0.05) 0%, rgba(74, 222, 128, 0) 70%)",
            }}
         />
         <div className="relative flex sm:flex-row flex-col items-center gap-4 sm:gap-6">
            <div className="bg-white shadow-sm mb-3 sm:mb-0 p-2 sm:p-3 rounded-full">
               <Award className="size-8 sm:size-10 text-green-600" />
            </div>
            <div className="flex-1 sm:text-left text-center">
               <div>
                  <p className="font-bold text-xl sm:text-2xl">¡Bienvenido{attendeeName ? `, ${attendeeName}` : ""}!</p>
                  <p className="mt-1 text-gray-700 text-sm sm:text-base">
                     Estamos encantados de tenerte en <span className="font-medium">{eventName}</span>. Explora las diferentes
                     conferencias disponibles y disfruta del contenido preparado especialmente para ti.
                  </p>

                  <div className="flex sm:flex-row flex-col items-center bg-blue-50 mt-4 p-3 border border-blue-100 rounded-lg">
                     <Video className="sm:mr-2 mb-2 sm:mb-0 size-5 text-blue-500 shrink-0" />
                     <p className="text-blue-800 text-xs sm:text-sm sm:text-left text-center">
                        Las grabaciones de las conferencias estarán disponibles una vez que el evento haya finalizado.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
