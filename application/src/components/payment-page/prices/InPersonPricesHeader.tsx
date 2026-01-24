import { UsersIcon } from "lucide-react";

interface InPersonPricesHeaderProps {
   congressTitle: string;
}

export default function InPersonPricesHeader({ congressTitle }: InPersonPricesHeaderProps) {
   return (
      <div className="mb-10 sm:mb-12 text-center">
         <div className="inline-flex items-center justify-center mb-4 bg-linear-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-100">
            <span className="text-green-700 text-sm font-semibold">Paso 2 de 3</span>
         </div>
         <h1 className="mb-4 font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl leading-tight">{congressTitle}</h1>
         <div className="flex justify-center items-center gap-3 mb-4">
            <div className="flex justify-center items-center bg-linear-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg shadow-green-500/30">
               <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl">Precios de Acceso Presencial</h2>
         </div>
         <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
   );
}
