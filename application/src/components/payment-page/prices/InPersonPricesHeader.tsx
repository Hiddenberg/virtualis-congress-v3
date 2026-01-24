import { UsersIcon } from "lucide-react";

export default function InPersonPricesHeader() {
   return (
      <div className="mb-8 text-center">
         <div className="flex justify-center items-center gap-3 mb-4">
            <div className="flex justify-center items-center bg-linear-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-14 sm:h-14">
               <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl">Precios de Acceso Presencial</h1>
         </div>
         <p className="text-gray-600 text-base sm:text-lg">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
   );
}
