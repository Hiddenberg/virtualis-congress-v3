import { PlayCircle } from "lucide-react";

export default function RecordingsIncludedBanner() {
   return (
      <div className="flex items-start gap-3 bg-purple-50 shadow-md p-4 sm:p-6 border-2 border-purple-200 rounded-xl sm:rounded-2xl">
         <div className="flex justify-center items-center bg-purple-100 shadow-lg shadow-purple-200/50 rounded-full w-10 sm:w-12 h-10 sm:h-12 shrink-0">
            <PlayCircle className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
         </div>
         <div className="flex-1 min-w-0">
            <h2 className="mb-1 font-bold text-purple-900 text-lg sm:text-xl">¡Incluye acceso a grabaciones!</h2>
            <p className="text-purple-700 text-sm sm:text-base">
               Este precio ya incluye el acceso a todas las grabaciones del congreso.
            </p>
         </div>
      </div>
   );
}
