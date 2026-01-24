import { UsersIcon } from "lucide-react";

interface InPersonPricesHeaderProps {
   congressTitle: string;
}

export default function InPersonPricesHeader({ congressTitle }: InPersonPricesHeaderProps) {
   return (
      <div className="mb-8 text-center">
         <h1 className="mb-4 font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl">{congressTitle}</h1>
         <div className="flex justify-center items-center gap-3 mb-4">
            <div className="flex justify-center items-center bg-linear-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-14 sm:h-14">
               <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl">Precios de Acceso Presencial</h2>
         </div>
         <p className="text-gray-600 text-base sm:text-lg">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
   );
}
