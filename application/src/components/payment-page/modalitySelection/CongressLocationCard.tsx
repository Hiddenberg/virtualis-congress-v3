import { MapPinIcon, MonitorIcon } from "lucide-react";

interface CongressLocationCardProps {
   location: string;
}

export default function CongressLocationCard({ location }: CongressLocationCardProps) {
   return (
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-md mb-8 p-6 sm:p-8 border-2 border-blue-200/50 rounded-xl sm:rounded-2xl backdrop-blur-sm">
         <div className="flex items-start gap-4">
            <div className="flex justify-center items-center bg-linear-to-br from-blue-500 to-blue-600 rounded-full w-12 sm:w-14 h-12 sm:h-14 shrink-0 shadow-lg shadow-blue-500/30">
               <MapPinIcon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <h2 className="mb-2 font-bold text-gray-900 text-lg sm:text-xl">Ubicación del congreso</h2>
               <p className="mb-3 text-gray-800 text-base sm:text-lg font-medium">{location}</p>
               <div className="inline-flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-sm sm:text-base">
                  <MonitorIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-semibold">También disponible en línea</span>
               </div>
            </div>
         </div>
      </div>
   );
}
