import { format } from "@formkit/tempo";
import { Clock, Play, Radio } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";
import { getConferenceById } from "@/features/conferences/services/conferenceServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";

export default async function ClosingConferenceBanner() {
   const congress = await getLatestCongress();
   if (!congress.showClosingConferenceBanner) {
      return null;
   }

   const closingConference = await getConferenceById("1pu5kqd5vujlab3");

   if (!closingConference) {
      return null;
   }

   const formattedTime = format({
      date: closingConference.startTime,
      format: "hh:mm A",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });

   return (
      <div className="flex justify-center mb-4 sm:mb-6 px-3 sm:px-4">
         <div className="w-full max-w-4xl">
            <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-white shadow-lg p-4 sm:p-6 md:p-8 border border-purple-200 rounded-xl sm:rounded-2xl overflow-hidden">
               {/* Decorative background elements */}
               <div className="top-0 right-0 absolute opacity-5">
                  <Play className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 text-purple-600" />
               </div>

               <div className="relative">
                  {/* Badge */}
                  <div className="flex justify-center mb-3 sm:mb-4">
                     <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-purple-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                        <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-700 shrink-0" />
                        <span className="font-semibold text-purple-700 text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
                           Conferencia de Clausura
                        </span>
                     </div>
                  </div>

                  {/* Main Content */}
                  <div className="mb-4 sm:mb-6 text-center">
                     <h2 className="mb-2 sm:mb-3 px-1 font-bold text-slate-800 text-xl sm:text-2xl md:text-3xl leading-tight">
                        {closingConference.title}
                     </h2>
                     <p className="mx-auto px-1 max-w-2xl text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
                        No te pierdas la sesión de clausura donde se presentarán conclusiones y avances futuros en el campo de la
                        Medicina Interna.
                     </p>
                  </div>

                  {/* Date and Time Info */}
                  <div className="flex sm:flex-row flex-col justify-center items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                     <div className="flex justify-center items-center gap-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg w-full sm:w-auto">
                        <Radio className="w-4 sm:w-5 h-4 sm:h-5 text-white shrink-0" />
                        <span className="font-semibold text-white text-sm sm:text-base md:text-lg">En vivo</span>
                     </div>
                     <div className="flex justify-center items-center gap-2 bg-white shadow-sm px-3 sm:px-4 py-2 sm:py-2.5 border border-purple-100 rounded-lg w-full sm:w-auto">
                        <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-800 text-sm sm:text-base md:text-lg">{formattedTime}</span>
                     </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-center">
                     <LinkButton
                        href={`/conference/${closingConference.id}`}
                        variant="purple"
                        className="shadow-md hover:shadow-lg px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto font-semibold text-sm sm:text-base md:text-lg transition-shadow"
                     >
                        <Play className="w-4 sm:w-5 h-4 sm:h-5" />
                        Unirse a la conferencia
                     </LinkButton>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
