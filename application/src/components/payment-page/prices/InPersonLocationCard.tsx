import { MapPinIcon } from "lucide-react";

interface InPersonLocationCardProps {
   location: string;
}

export default function InPersonLocationCard({ location }: InPersonLocationCardProps) {
   return (
      <div className="bg-linear-to-br from-green-50 to-emerald-50 shadow-sm mb-8 p-6 sm:p-8 border border-green-100 rounded-xl sm:rounded-2xl">
         <div className="flex items-start gap-4">
            <div className="flex justify-center items-center bg-linear-to-br from-green-500 to-green-600 rounded-full w-12 sm:w-14 h-12 sm:h-14 shrink-0">
               <MapPinIcon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <h2 className="mb-2 font-bold text-gray-900 text-lg sm:text-xl">Ubicación del congreso</h2>
               <p className="text-gray-700 text-base sm:text-lg">{location}</p>
            </div>
         </div>
      </div>
   );
}
