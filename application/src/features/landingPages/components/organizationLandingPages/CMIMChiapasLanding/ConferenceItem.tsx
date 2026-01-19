import { Clock, Coffee, User } from "lucide-react";

interface ConferenceItemProps {
   title: string;
   description: string;
   speakerName: string;
   startTime: string;
   endTime: string;
   isBreak?: boolean;
}

export default function ConferenceItem({
   title,
   description,
   speakerName,
   startTime,
   endTime,
   isBreak = false,
}: ConferenceItemProps) {
   return (
      <div
         className={`rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
            isBreak
               ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
               : "bg-white border-gray-200 hover:border-blue-300"
         }`}
      >
         <div className="p-3 md:p-6">
            <div className="flex flex-col items-start gap-4">
               {/* Time Badge */}
               <div
                  className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
                     isBreak
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
               >
                  <div className="flex items-center gap-1">
                     <Clock className="w-4 h-4" />
                     <span>
                        {startTime} - {endTime}
                     </span>
                  </div>
               </div>

               <div className="flex-1 w-full min-w-0">
                  {/* Conference Title */}
                  <h3
                     className={`text-lg font-bold mb-2 ${
                        isBreak ? "text-amber-900" : "text-gray-900"
                     }`}
                  >
                     {isBreak && <Coffee className="inline mr-2 w-5 h-5" />}
                     {title}
                  </h3>

                  {/* Description */}
                  {description && (
                     <p
                        className={`text-sm mb-3 leading-relaxed ${
                           isBreak ? "text-amber-700" : "text-gray-700"
                        }`}
                     >
                        {description}
                     </p>
                  )}

                  {/* Speaker Information */}
                  {speakerName && !isBreak && (
                     <div className="flex md:flex-row flex-col items-center gap-3 bg-gray-50 p-3 rounded-lg w-full">
                        {/* Speaker Image Placeholder */}
                        <div className="flex-shrink-0">
                           <div className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-12 h-12">
                              <User className="w-6 h-6 text-white" />
                           </div>
                        </div>

                        {/* Speaker Details */}
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-center md:justify-start items-center gap-2 mb-1">
                              <span className="bg-blue-100 px-2 py-1 rounded-full font-medium text-blue-600 text-xs">
                                 PONENTE
                              </span>
                           </div>
                           <p className="font-semibold text-gray-900 text-sm truncate">
                              {speakerName}
                           </p>
                        </div>
                     </div>
                  )}

                  {/* Special Session Styling */}
                  {!speakerName && !isBreak && (
                     <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border border-purple-100 rounded-lg">
                        <div className="bg-purple-400 rounded-full w-3 h-3" />
                        <span className="font-medium text-purple-700 text-sm">
                           Sesión Especial
                        </span>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Bottom Accent Line */}
         {!isBreak && (
            <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 h-1" />
         )}
      </div>
   );
}
