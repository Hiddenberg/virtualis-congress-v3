import { format } from "@formkit/tempo";
import { CalendarIcon, Clock, ClockIcon, Users, Video } from "lucide-react";

export interface GuestScheduledPageProps {
   title: string;
   description?: string;
   startTime: string;
}

export default function GuestScheduledPage({ title, description, startTime }: GuestScheduledPageProps) {
   return (
      <div className="flex justify-center items-center bg-gradient-to-br from-stone-50 to-stone-100 p-4 min-h-screen">
         <div className="w-full max-w-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-stone-800 to-stone-900 shadow-lg mb-6 p-8 rounded-2xl">
               <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 p-4 rounded-xl">
                     <Video className="w-8 h-8 text-stone-800" />
                  </div>
                  <div>
                     <h1 className="font-bold text-stone-100 text-3xl">Próximamente</h1>
                     <p className="text-stone-300 text-lg">La transmisión iniciará pronto</p>
                  </div>
               </div>
            </div>

            {/* Class Info Section */}
            <div className="bg-white shadow-lg mb-6 p-8 border border-stone-200 rounded-2xl">
               <div className="bg-gradient-to-r from-amber-50 to-amber-100 mb-6 p-6 rounded-xl">
                  <h2 className="mb-2 font-semibold text-amber-800 text-2xl capitalize">{title}</h2>
                  {description && <p className="text-stone-600 text-base leading-relaxed">{description}</p>}
               </div>

               {/* Schedule Info */}
               <div className="bg-gradient-to-r from-stone-50 to-stone-100 mb-6 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="bg-stone-200 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-stone-700" />
                     </div>
                     <h3 className="font-semibold text-stone-800 text-lg">Horario Programado</h3>
                  </div>

                  <div className="flex sm:flex-row flex-col gap-4 text-stone-600">
                     <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-amber-600" />
                        <span className="font-medium">
                           {format({
                              date: startTime,
                              format: "DD/MM/YYYY",
                           })}
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-amber-600" />
                        <span className="font-medium">
                           {format({
                              date: startTime,
                              format: "hh:mm A",
                           })}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Wait Message */}
               <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 border border-amber-200 rounded-xl text-center">
                  <div className="flex justify-center items-center gap-3 mb-3">
                     <div className="bg-amber-200 p-3 rounded-full">
                        <Users className="w-6 h-6 text-amber-700" />
                     </div>
                     <h3 className="font-semibold text-amber-800 text-lg">Sala de Espera</h3>
                  </div>
                  <p className="text-amber-700 text-sm leading-relaxed">
                     Podrás unirte a la transmisión en cuanto el administrador inicie la sesión. Mantén esta página abierta para
                     recibir acceso automático.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
