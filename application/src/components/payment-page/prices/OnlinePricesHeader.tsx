import { MonitorIcon } from "lucide-react";

interface OnlinePricesHeaderProps {
   congressTitle: string;
}

export default function OnlinePricesHeader({ congressTitle }: OnlinePricesHeaderProps) {
   return (
      <div className="mb-10 sm:mb-12 text-center">
         <h1 className="mb-4 font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl leading-tight">{congressTitle}</h1>
         <div className="flex justify-center items-center gap-3 mb-4">
            <div className="flex justify-center items-center bg-linear-to-br from-blue-500 to-blue-600 shadow-blue-500/30 shadow-lg rounded-full w-12 sm:w-14 h-12 sm:h-14">
               <MonitorIcon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl">Precios de Acceso Online</h2>
         </div>
         <p className="mx-auto max-w-2xl text-gray-600 text-lg sm:text-xl">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>
   );
}
