import { Clock } from "lucide-react";

export default function UpcomingBox() {
   return (
      <div className="bg-white mt-6 md:mt-0 p-5 border border-gray-200 rounded-2xl">
         <h3 className="text-gray-900">Próxima conferencia en esta sala</h3>
         <div className="flex items-start gap-4 mt-4">
            <div className="bg-gray-100 p-3 rounded-xl text-center">
               <div className="font-bold text-2xl leading-none">16</div>
               <div className="text-gray-600 text-xs">Oct</div>
            </div>
            <div className="flex-1">
               <p className="font-medium text-gray-800 text-sm">Innovación en Terapias Genéticas</p>
               <div className="inline-flex items-center gap-2 bg-blue-50 mt-2 px-2 py-1 rounded-full font-medium text-blue-700 text-xs">
                  <Clock size={14} /> 18:00 h
               </div>
            </div>
         </div>
         <div className="flex items-center gap-2 mt-3">
            <span className="bg-gray-300 rounded-full w-1 h-1" />
            <span className="bg-blue-600 rounded-full w-1 h-1" />
            <span className="bg-gray-300 rounded-full w-1 h-1" />
         </div>
      </div>
   );
}
