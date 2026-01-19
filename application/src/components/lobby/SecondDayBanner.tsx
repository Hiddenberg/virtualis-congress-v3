import { Sunrise, Zap } from "lucide-react";
import { InaugurationVideoBanner } from "@/features/organizations/organizationSpecifics/HGEA/data/components/HGEALobbyVideoComponents";

export default function SecondDayBanner({
   congressDayNumber,
}: {
   congressDayNumber: 1 | 2 | 3 | 4 | 5 | 6;
}) {
   // If the day is the first day (base 0), we show the inauguration video
   if (congressDayNumber === 1) {
      return (
         <InaugurationVideoBanner playbackId="h00D6JrqlVF2eXWcktGg7qH6BGPa1KjKKtoATTAN8Qzo" />
      );
   }

   // If the day is the second day (base 1), we show the second day message
   const messageMap: Record<number, string> = {
      2: "¡Bienvenidos al segundo día del evento!",
      3: "¡Bienvenidos al tercer día del evento!",
      4: "¡Bienvenidos al cuarto día del evento!",
      5: "¡Bienvenidos al quinto día del evento!",
      6: "¡Bienvenidos al sexto día del evento!",
   };

   const message = messageMap[congressDayNumber];

   return (
      <div className="flex justify-center mb-6 px-4">
         <div className="w-full max-w-3xl">
            <div className="relative bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-sm p-6 md:p-8 border border-amber-100 rounded-2xl overflow-hidden">
               {/* Decorative elements */}
               <div className="top-0 right-0 absolute opacity-10">
                  <Zap className="w-32 h-32 text-amber-600" />
               </div>

               <div className="relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                     <div className="flex justify-center items-center bg-linear-to-br from-amber-100 to-orange-100 shadow-sm rounded-full w-14 h-14">
                        <Sunrise className="w-7 h-7 text-amber-600" />
                     </div>
                  </div>

                  {/* Message */}
                  <div className="text-center">
                     <h2 className="mb-3 font-bold text-slate-800 text-2xl md:text-3xl leading-tight">
                        {message}
                     </h2>
                     <p className="mx-auto mb-2 max-w-2xl font-medium text-amber-700 text-lg md:text-xl leading-relaxed">
                        Continuamos con más aprendizaje y conocimiento
                     </p>
                     <p className="mx-auto max-w-2xl text-slate-600 text-base md:text-lg leading-relaxed">
                        Hoy tenemos preparadas excelentes conferencias para ti
                     </p>
                  </div>

                  {/* Decorative bottom accent */}
                  <div className="flex justify-center gap-1.5 mt-6">
                     <div className="bg-amber-300 rounded-full w-2 h-2" />
                     <div className="bg-orange-300 rounded-full w-2 h-2" />
                     <div className="bg-yellow-300 rounded-full w-2 h-2" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
