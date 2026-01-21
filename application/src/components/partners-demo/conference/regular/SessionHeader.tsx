import { Eye } from "lucide-react";

export default function SessionHeader() {
   return (
      <div className="mt-4 mb-2">
         <h1 className="font-semibold text-gray-900 text-2xl">
            Nanotecnología en la Administración de Medicamentos: Retos y Oportunidades
         </h1>
         <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="inline-flex items-center gap-2 text-gray-700 text-sm">
               <div className="bg-gray-200 rounded-full w-8 h-8" />
               <div>
                  <p className="font-medium">Dra. Ana Gómez Martínez</p>
                  <p className="text-gray-500 text-xs">Directora de Investigación en Farmacología</p>
               </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-100 ml-auto px-3 py-1 rounded-full text-gray-700 text-xs">
               <Eye size={14} /> 657
            </div>
            <button className="bg-gray-900 hover:brightness-110 px-4 py-2 rounded-lg font-medium text-white text-sm">
               Ver CV
            </button>
         </div>
      </div>
   );
}
