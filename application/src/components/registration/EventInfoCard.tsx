import { Calendar, Clock, Globe, Users } from "lucide-react";

export default function EventInfoCard() {
   return (
      <div className="bg-[#2563EB] shadow-lg hover:shadow-xl p-8 rounded-[32px] w-full transition-all">
         <div className="md:flex md:flex-col gap-8 grid grid-cols-1 text-white">
            {/* Date Section */}
            <div className="flex flex-col items-start space-y-2">
               <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-white/80" />
                  <p className="text-white/80 text-base">FECHA DE INICIO</p>
               </div>
               <p className="font-bold text-4xl">10/ABRIL/2025</p>
            </div>

            {/* Time Section */}
            <div className="flex flex-col items-start space-y-2">
               <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-white/80" />
                  <p className="text-white/80 text-base">CONFERENCIAS DISPONIBLES</p>
               </div>
               <p className="font-bold text-4xl">+24 Horas</p>
            </div>

            <div className="hidden sm:block col-span-2 bg-white/20 w-full h-px" />

            {/* Participants Section */}
            <div className="flex flex-col items-start space-y-2">
               <p className="font-bold text-4xl">Participantes</p>
               <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-white/80" />
                  <p className="text-white/80 text-base">INTERNACIONALES</p>
               </div>
            </div>

            {/* Virtual Section */}
            <div className="flex flex-col items-start space-y-2">
               <p className="font-bold text-4xl">100% Virtual</p>
               <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-white/80" />
                  <p className="text-white/80 text-base">ACCESO GLOBAL</p>
               </div>
            </div>
         </div>
      </div>
   );
}
