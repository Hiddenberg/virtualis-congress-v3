import { MapPin } from "lucide-react";

interface LocationDisplayProps {
   location: string;
}

export default function LocationDisplay({ location }: LocationDisplayProps) {
   return (
      <div className="mb-6 flex justify-center">
         <div className="bg-gray-50 px-6 py-3 border border-gray-200 rounded-xl flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <div className="text-left">
               <div className="font-semibold text-gray-900 text-sm">Ubicación del Evento</div>
               <div className="text-gray-600 text-sm">{location}</div>
            </div>
         </div>
      </div>
   );
}
