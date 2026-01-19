import { Sparkles, Sun } from "lucide-react";

export default function DayCompletedBanner() {
   return (
      <div className="flex justify-center mb-6 px-4">
         <div className="w-full max-w-3xl">
            <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 shadow-sm p-6 md:p-8 border border-indigo-100 rounded-2xl overflow-hidden">
               {/* Decorative elements */}
               <div className="top-0 right-0 absolute opacity-10">
                  <Sparkles className="w-32 h-32 text-indigo-600" />
               </div>

               <div className="relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                     <div className="flex justify-center items-center bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm rounded-full w-14 h-14">
                        <Sun className="w-7 h-7 text-indigo-600" />
                     </div>
                  </div>

                  {/* Message */}
                  <div className="text-center">
                     <h2 className="mb-3 font-bold text-slate-800 text-2xl md:text-3xl leading-tight">
                        ¡Ha sido un gran día!
                     </h2>
                     <p className="mx-auto mb-2 max-w-2xl font-medium text-indigo-700 text-lg md:text-xl leading-relaxed">
                        Todas las conferencias del día han finalizado.
                        <br />
                        Felicidades por tanto aprendizaje
                     </p>
                     <p className="mx-auto max-w-2xl text-slate-600 text-base md:text-lg leading-relaxed">
                        Prepárate para mañana que continúa con mucho más
                     </p>
                  </div>

                  {/* Decorative bottom accent */}
                  <div className="flex justify-center gap-1.5 mt-6">
                     <div className="bg-indigo-300 rounded-full w-2 h-2" />
                     <div className="bg-purple-300 rounded-full w-2 h-2" />
                     <div className="bg-blue-300 rounded-full w-2 h-2" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
